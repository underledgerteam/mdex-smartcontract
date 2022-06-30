//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

interface ICurveRegistry {
    function find_pool_for_coins(address _form, address _to, uint256 i) external view returns(address);
}