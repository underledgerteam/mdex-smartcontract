//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMdexCrossChainSwap.sol";
import "./MdexController.sol";

contract MdexCrossChainSwap is Ownable, Pausable {
    using SafeMath for uint256;

    address public stableCoin;
    IMdexCrossChainSwap public serviceCrossChainSwap;
    MdexController public mdexController;

    function swap(
        address tokenIn,
        uint256 amount,
        uint256 routeIndex,
        bytes calldata payload,
        bytes calldata apiPayload
    ) external whenNotPaused {
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amount, "not enough erc20 balance");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        _swap(tokenIn, stableCoin, amount, routeIndex);
        _crossChainSwap(IERC20(stableCoin).balanceOf(address(this)), payload, apiPayload);
    }

    function spiltSwap(
        address tokenIn,
        uint256 amount,
        uint256[] calldata routes,
        uint256[] calldata srcAmounts,
        bytes calldata payload,
        bytes calldata apiPayload
    ) external whenNotPaused {
        require(routes.length > 0, "routes can not be empty");
        require(routes.length == srcAmounts.length, "routes and srcAmounts lengths mismatch");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenIn).approve(address(mdexController), amount);
        mdexController.spiltSwap(tokenIn, stableCoin, amount, routes, srcAmounts);
        _crossChainSwap(IERC20(stableCoin).balanceOf(address(this)), payload, apiPayload);
    }

    function setPause() public onlyOwner {
        _pause();
    }

    function setUnPause() public onlyOwner {
        _unpause();
    }

    function setStableCoin(address _token) public onlyOwner {
        stableCoin = _token;
    }

    function setController(MdexController _controller) public onlyOwner {
        mdexController = _controller;
    }

    function setService(IMdexCrossChainSwap _service) public onlyOwner {
        serviceCrossChainSwap = _service;
    }

    function _swap(
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint256 routeIndex
    ) private {
        IERC20(tokenIn).approve(address(mdexController), amount);
        mdexController.swap(tokenIn, tokenOut, amount, routeIndex);
    }

    function _crossChainSwap(
        uint256 amount,
        bytes calldata payload,
        bytes calldata apiPayload
    ) private {
        IERC20(stableCoin).approve(address(serviceCrossChainSwap), amount);
        serviceCrossChainSwap.swap(amount, payload, apiPayload);
    }
}
