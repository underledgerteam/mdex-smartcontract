//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "../interfaces/IMdexService.sol";
import "../interfaces/ICurveSwap.sol";
import "../interfaces/ICurveRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
contract MdexCurveService is IMdexService {
    ICurveRegistry public immutable curveRegistry;
    constructor( address _controller, ICurveRegistry _curve) IMdexService(_controller){
        curveRegistry = _curve;
    }
    function curveSwap(address token1, address token2, uint256 amount, address reciever) internal {
        uint256 min_dy;
        address pool;
        IERC20(token1).transferFrom(address(controller), address(this), amount);
        (pool)  = curveRegistry.find_pool_for_coins(token1, token2, 0);
        (min_dy) = ICurveSwap(pool).get_dy(0, 1, amount);
        IERC20(token1).approve(pool, amount);
        ICurveSwap(pool).exchange(0, 1, amount, min_dy, reciever);
       
    }
    function _swap(address token1, address token2, uint256 amount, address reciever) internal override {
        require(msg.sender == address(controller), "Only Controller Call");
        curveSwap(token1, token2, amount, reciever);
    }

}