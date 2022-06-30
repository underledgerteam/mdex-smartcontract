//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "../MdexController.sol";
abstract contract IMdexService {
    MdexController public immutable controller;

     constructor(address _controller) {
        controller = MdexController(_controller);
    }

    modifier onlyController() {
        require(msg.sender == address(controller), "Not Controller");
        _;
    }

    function _swap(address token1, address token2, uint256 amount, address reciever) internal virtual;

    function swap(address token1, address token2, uint256 amount, address reciever) public onlyController {
        _swap(token1, token2, amount, reciever);
    }

}