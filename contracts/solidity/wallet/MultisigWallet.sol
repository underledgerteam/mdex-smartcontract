//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
contract MultiSigWallet {

    address[] public teams;
    uint public numConfirmationsRequired;
    uint public transactionCount;
    address public _stableCoin;

    struct Transaction {
        uint id;
        address to;
        address caller;
        uint value;
        bool executed;
        uint numConfirmations;
        uint timestamp;
    }

    mapping(address => bool) public isTeam;
    mapping(uint => mapping(address => bool)) public isConfirmed;
    mapping(uint => Transaction) public transactionById;
    mapping(address => mapping(uint => Transaction)) public myTransactionById;

    modifier onlyTeam() {
        require(isTeam[msg.sender], "not team");
        _;
    }


    modifier notExecuted(uint transactionId) {
        require(!transactionById[transactionId].executed, "tx already executed");
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

    }

    function submitWithdrawTransaction(address to, uint value) public onlyTeam {

        require(IERC20(_stableCoin).balanceOf(address(this)) >= value, "erc20 insufficient balance");

        transactionCount += 1;

        transactionById[transactionCount] = Transaction({
            id: transactionCount,
            to: to,
            caller: msg.sender,
            value: value,
            executed: false,
            numConfirmations: 0,
            timestamp: block.timestamp
        });

        myTransactionById[msg.sender][transactionCount] = Transaction({
            id: transactionCount,
            to: to,
            caller: msg.sender,
            value: value,
            executed: false,
            numConfirmations: 0,
            timestamp: block.timestamp
        });

        emit WithdrawERC20(
            msg.sender,
            to,
            value
        );

    }

    function getBalance() public onlyTeam view returns(uint256) {
        return IERC20(_stableCoin).balanceOf(address(this));
    }

    function confirmTransaction(uint transactionId)
        public
        onlyTeam  
        notExecuted(transactionId)
        notConfirmed(transactionId)
        ownerNotConfirmed(transactionId, msg.sender)
    {
        Transaction storage transaction = transactionById[transactionId];
        Transaction storage callerTransaction = myTransactionById[transaction.caller][transactionId];

        require(transaction.id == transactionId, "tx does not exist");
        require(callerTransaction.id == transactionId, "tx does not exist");

        
        transaction.numConfirmations += 1;
        callerTransaction.numConfirmations +=  1;

        isConfirmed[transactionId][msg.sender] = true;

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
        notExecuted(transactionId)
    {
        Transaction storage transaction = transactionById[transactionId];
        Transaction storage callerTransaction = myTransactionById[transaction.caller][transactionId];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );
        require(IERC20(_stableCoin).balanceOf(address(this)) >= transaction.value, "erc20 insufficient balance");

        transaction.executed = true;
        callerTransaction.executed = true;

        IERC20(_stableCoin).transfer(msg.sender, transaction.value);

        emit ExecuteTransaction(msg.sender, transactionId);

    }
}