//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "./interfaces/IMdexService.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
contract MdexController is Ownable, Pausable {

    using SafeMath for uint256;

    address private stableCoin;
    address private multisigWallet;
    uint256 private fee = 1;

    constructor(address _multisigWallet){
        multisigWallet = _multisigWallet;
    }
    function swap(address tokenIn, address tokenOut, uint256 amount, address service) external whenNotPaused {
        uint256 netAmount;
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amount, "not enough erc20 balance");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        (netAmount) = _serviceFee(amount);
        IERC20(tokenIn).approve(service, amount);
        IMdexService(service).swap(tokenIn, tokenOut, netAmount, msg.sender);
        IMdexService(service).swap(tokenIn, stableCoin, amount - netAmount, multisigWallet);
    }


    function setPause() public onlyOwner {
        _pause();
    }
    function setUnPause() public onlyOwner{
        _unpause();
    }
    function setStableCoin(address token) public onlyOwner {
        stableCoin = token;
    }
    function setFee(uint256 newFee) public onlyOwner{
        fee = newFee;
    }

    function _serviceFee(uint256 amount) private view returns(uint256){
        uint256 totalFee = amount.mul(fee).div(100);
        return totalFee;
    }


}