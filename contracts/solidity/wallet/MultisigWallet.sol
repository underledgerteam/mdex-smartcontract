//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
contract MultiSigWallet {

    address[] public teams;
    uint public numConfirmationsRequired;
    uint public transactionCount;

    struct Transaction {
        uint id;
        address token;
        address to;
        uint value;
        bool executed;
        uint numConfirmations;
        bool isWithdrawETH;
    }

    mapping(address => bool) public isTeam;
    mapping(uint => mapping(address => bool)) public isConfirmed;
    mapping(uint => Transaction) public allTransaction;

    modifier onlyTeam() {
        require(isTeam[msg.sender], "not team");
        _;
    }


    modifier notExecuted(uint transactionId) {
        require(!allTransaction[transactionId].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint transactionId) {
        require(!isConfirmed[transactionId][msg.sender], "tx already confirmed");
        _;
    }


    event WithdrawETH ( address caller, address to, uint value);
    event WithdrawERC20 (address caller, address to, uint value);
    event ConfirmTransaction(address indexed member, uint indexed transactionId);
    event ExecuteTransaction(address indexed member, uint indexed transactionId);


    constructor(address[] memory team) {
        require(team.length > 0, "teams required");
        for (uint i = 0; i < team.length; i++) {
            address member = team[i];

            require(member != address(0), "invalid owner");
            require(!isTeam[member], "owner not unique");

            isTeam[member] = true;
            teams.push(member);
        }

        numConfirmationsRequired = 3;

    }

    receive() external payable {}


    function submitWithdrawETHTransaction(address to, uint value) public onlyTeam {

        transactionCount += 1;

        allTransaction[transactionCount] = Transaction({
            id: transactionCount,
            token: address(0),
            to: to,
            value: value,
            executed: false,
            numConfirmations: 0,
            isWithdrawETH: true
        });

        emit WithdrawETH(
            msg.sender,
            to,
            value
        );
    }


    function submitWithdrawERC20Transaction(address to, address token, uint value) public onlyTeam {

        transactionCount += 1;

        allTransaction[transactionCount] = Transaction({
            id: transactionCount,
            token: token,
            to: to,
            value: value,
            executed: false,
            numConfirmations: 0,
            isWithdrawETH: false
        });

        emit WithdrawERC20(
            msg.sender,
            to,
            value
        );

    }


    function confirmTransaction(uint transactionId)
        public
        onlyTeam  
        notExecuted(transactionId)
        notConfirmed(transactionId)
    {
        Transaction storage transaction = allTransaction[transactionId];

        require(transaction.id == transactionId, "tx does not exist");
        
        transaction.numConfirmations += 1;
        isConfirmed[transactionId][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, transactionId);

    }

    function executeTransaction(uint transactionId)
        public
        onlyTeam
        notExecuted(transactionId)
    {
        Transaction memory transaction = allTransaction[transactionId];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );


        if(transaction.isWithdrawETH){
            
            transaction.executed = true;
            
            (bool sc, ) = transaction.to.call{value: transaction.value}("");

            require(sc, "transaction reverted");

            emit ExecuteTransaction(msg.sender, transactionId);
        }else{
            transaction.executed = true;
            IERC20(transaction.token).transfer(msg.sender, transaction.value);
            emit ExecuteTransaction(msg.sender, transactionId);

        }

    }
    
     


}