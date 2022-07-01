//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;
import "../interfaces/IMdexService.sol";


contract MdexUniSwapService is IMdexService {

     constructor( address _controller) IMdexService(_controller){}

    function uniSwap(address token1, address token2, uint256 amount, address reciever) internal {}

     function _swap(address token1, address token2, uint256 amount, address reciever) internal override {
        require(msg.sender == address(controller), "Only Controller Call");
        uniSwap(token1, token2, amount, reciever);
    }

}
