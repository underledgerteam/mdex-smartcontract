//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "../MdexCrossChainSwap.sol";

abstract contract IMdexCrossChainSwap {
    MdexCrossChainSwap public immutable mdexCrossChainSwap;

    constructor(address _mdexCrossChainSwap) {
        mdexCrossChainSwap = MdexCrossChainSwap(_mdexCrossChainSwap);
    }

    modifier onlyThisContract() {
        require(msg.sender == address(mdexCrossChainSwap), "Not Contract");
        _;
    }

    function _swap(uint256 amount, bytes calldata payload) internal virtual;

    function swap(uint256 amount, bytes calldata payload) public onlyThisContract {
        _swap(amount, payload);
    }
}
