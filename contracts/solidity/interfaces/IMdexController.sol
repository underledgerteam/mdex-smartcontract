//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;
interface IMdexController {
    function getDestinationReturnAmount(address tokenIn, address tokenOut, uint256 amount, uint256 routeIndex) external view returns(uint256);
}