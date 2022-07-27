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

    address private stableCoin;
    IMdexCrossChainSwap private serviceCrossChainSwap;
    MdexController private mdexController;

    function swap(
        address tokenIn,
        uint256 amount,
        bytes calldata payload
    ) external whenNotPaused {
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amount, "not enough erc20 balance");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);

        // collect fee
        _swap(tokenIn, stableCoin, amount);
        _crossChainSwap(IERC20(stableCoin).balanceOf(address(this)), payload);
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
        uint256 amount
    ) private {
        IERC20(tokenIn).approve(address(mdexController), amount);
        mdexController.swap(tokenIn, tokenOut, amount, 0);
    }

    function _crossChainSwap(uint256 amount, bytes calldata payload) private {
        IERC20(stableCoin).approve(address(serviceCrossChainSwap), amount);
        serviceCrossChainSwap.swap(amount, payload);
    }
}
