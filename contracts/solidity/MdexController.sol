//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "./interfaces/IMdexService.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./MdexRoutingManagement.sol";
contract MdexController is Ownable, Pausable, MdexRoutingManagement {

    using SafeMath for uint256;

    address private stableCoin;
    address private multisigWallet;
    uint256 private fee = 1;
    constructor(address _multisigWallet){
        multisigWallet = _multisigWallet;
    }

    function swap(address tokenIn, address tokenOut, uint256 amount, uint256 routeIndex) external whenNotPaused {
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amount, "not enough erc20 balance");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        uint256 netAmount = _serviceFee(amount);
        _swap(routeIndex, tokenIn, tokenOut, amount - netAmount, msg.sender);

        // collect fee
        _swap(routeIndex, tokenIn, stableCoin, netAmount, multisigWallet);
    }

    function spiltSwap(address tokenIn, address tokenOut, uint256 amount, uint256[] calldata routes,  uint256[] calldata srcAmounts) external whenNotPaused {
        require(routes.length > 0, "routes can not be empty");
        require(routes.length == srcAmounts.length, "routes and srcAmounts lengths mismatch");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        uint256 netAmount = _serviceFee(amount);

        for (uint i = 0; i < routes.length; i++) {
            uint256 tradingRouteIndex = routes[i];
            uint256 srcAmount = srcAmounts[i];
           _swap(tradingRouteIndex, tokenIn, tokenOut, srcAmount, msg.sender);
        }
        _swap(routes[0], tokenIn, stableCoin, netAmount, multisigWallet);
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

    function _swap(uint256 routeIndex, address tokenIn, address tokenOut, uint256 amount, address receiver) private onlyTradingRouteEnabled(routeIndex) {
        IMdexService service = tradingRoutes[routeIndex].service;
        IERC20(tokenIn).approve(address(service), amount);
        service.swap(tokenIn, tokenOut, amount, receiver);

    }
}