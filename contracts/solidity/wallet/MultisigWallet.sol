//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
contract MultiSigWallet {

    enum StatusTransaction{WATING, READY, QUEUE , FAIL, SUCCESS}
    address[] public teams;
    uint public numConfirmationsRequired;
    uint public transactionCount;
    uint public delayTime;
    address public _stableCoin;

    struct Transaction {
        uint id;
        address to;
        address caller;
        uint value;
        uint numConfirmations;
        uint numNoConfirmations;
        uint timestamp;
        uint timeLock;
        StatusTransaction status;
    }

    mapping(address => bool) public isTeam;
    mapping(uint => mapping(address => bool)) public isConfirmed;
    mapping(uint => Transaction) public transactionById;

    modifier onlyTeam() {
        require(isTeam[msg.sender], "not team");
        _;
    }

    modifier notConfirmed(uint transactionId) {
        require(!isConfirmed[transactionId][msg.sender], "tx already confirmed");
        _;
    }

    modifier ownerNotConfirmed(uint transactionId, address owner) {
        require(transactionById[transactionId].caller != owner, "owner cannot vote confirm");
        _;
    }

    modifier isReady(uint transactionId) {
        require(transactionById[transactionId].status == StatusTransaction.READY, "tx is not already to executed");
        _;
    }

    modifier isCancel(uint transactionId){
        require(transactionById[transactionId].timeLock > block.timestamp, "tx is aleady approve");
        _;
    }

    modifier noTimeLock(uint transactionId){
        require(transactionById[transactionId].timeLock < block.timestamp, "tx is wating approve");
        _; 
    }

    modifier isWating(uint transactionId){
        require(transactionById[transactionId].status == StatusTransaction.WATING, "tx must be status wating");
        _; 
    }


    modifier isOwnerTransaction(uint transactionId, address owner){
        require(transactionById[transactionId].caller == owner, "only owner transaction call execute");
        _; 
    }

    event WithdrawETH ( address caller, address to, uint value);
    event WithdrawERC20 (address caller, address to, uint value);
    event ConfirmTransaction(address indexed member, uint indexed transactionId);
    event ExecuteTransaction(address indexed member, uint indexed transactionId);


    constructor(address[] memory team, address stableCoin) {
        require(team.length > 0, "teams required");
        _stableCoin = stableCoin;
        for (uint i = 0; i < team.length; i++) {
            address member = team[i];

            require(member != address(0), "invalid owner");
            require(!isTeam[member], "owner not unique");

            isTeam[member] = true;
            teams.push(member);
        }

        numConfirmationsRequired = 3;
        delayTime = 1;

    }

    function setNumberOfRequire(uint number) public onlyTeam{
        numConfirmationsRequired = number;
    }

    function submitWithdrawTransaction(address to, uint value) public onlyTeam {

        require(IERC20(_stableCoin).balanceOf(address(this)) >= value, "erc20 insufficient balance");

        transactionCount += 1;

        transactionById[transactionCount] = Transaction({
            id: transactionCount,
            to: to,
            caller: msg.sender,
            value: value,
            numConfirmations: 1,
            numNoConfirmations: 0,
            timestamp: block.timestamp,
            timeLock: 0,
            status: StatusTransaction.WATING
        });

        emit WithdrawERC20(
            msg.sender,
            to,
            value
        );

    }

    function _updateData(uint id) private {
        Transaction storage transaction = transactionById[id];
        if(transaction.status ==  StatusTransaction.QUEUE && transaction.timeLock >= block.timestamp) {
            transaction.status = StatusTransaction.READY;
        }
    }

    function uppdateData() public onlyTeam{
        for(uint i = 1; i < transactionCount + 1; i++){
            _updateData(i);
        }
    }

    function getBalance() public onlyTeam view returns(uint256) {
        return IERC20(_stableCoin).balanceOf(address(this));
    }


    function setDelay(uint delay) public onlyTeam {
        delayTime = delay;
    }

    function confirmTransaction(uint transactionId)
        public
        onlyTeam  
        notConfirmed(transactionId)
        ownerNotConfirmed(transactionId, msg.sender)
        isWating(transactionId)
    {
        Transaction storage transaction = transactionById[transactionId];

        require(transaction.id == transactionId, "tx does not exist");

        
        transaction.numConfirmations += 1;

        isConfirmed[transactionId][msg.sender] = true;

        if(transaction.numConfirmations >= numConfirmationsRequired ){
            transaction.status =  StatusTransaction.QUEUE;
            transaction.timeLock = block.timestamp + delayTime;

        }

        emit ConfirmTransaction(msg.sender, transactionId);

    }


    function cancelTransaction(uint transactionId) public onlyTeam isCancel(transactionId) {
        Transaction storage transaction = transactionById[transactionId];
        require(transaction.id == transactionId, "tx does not exist");
        transaction.status =  StatusTransaction.FAIL;
    }
    
    function noConfirmTransaction(uint transactionId)
        public
        onlyTeam  
        notConfirmed(transactionId)
        ownerNotConfirmed(transactionId, msg.sender)
        isWating(transactionId)
    {
        Transaction storage transaction = transactionById[transactionId];

        require(transaction.id == transactionId, "tx does not exist");

        
        transaction.numNoConfirmations += 1;

        isConfirmed[transactionId][msg.sender] = true;

        if(transaction.numNoConfirmations >= numConfirmationsRequired){
            transaction.status =  StatusTransaction.FAIL;
        }

        emit ConfirmTransaction(msg.sender, transactionId);

    }

    function  getTransactions() public view returns(Transaction[] memory ) {
        Transaction[] memory transactions = new Transaction[](transactionCount);
        for(uint i = 0; i < transactionCount; i++){
            transactions[i] = transactionById[i];
        }
        return transactions;
    }

    function executeTransaction(uint transactionId)
        public
        onlyTeam
        isReady(transactionId)
        noTimeLock(transactionId)
        isOwnerTransaction(transactionId, msg.sender)
    {
        Transaction storage transaction = transactionById[transactionId];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );
        
        require(IERC20(_stableCoin).balanceOf(address(this)) >= transaction.value, "erc20 insufficient balance");

        transaction.status = StatusTransaction.SUCCESS;

        IERC20(_stableCoin).transfer(msg.sender, transaction.value);

        emit ExecuteTransaction(msg.sender, transactionId);

    }
}