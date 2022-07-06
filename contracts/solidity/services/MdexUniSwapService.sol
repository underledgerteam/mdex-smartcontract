//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;
import "../interfaces/IMdexService.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../amm/periphery/interfaces/IUniswapV2Router02.sol";
import "../amm/core/interfaces/IUniswapV2Factory.sol";
import "hardhat/console.sol";
contract MdexUniSwapService is IMdexService {

    IUniswapV2Router02 public immutable ROUTER;
    IUniswapV2Factory public immutable FACTORY;
    constructor(address _controller, IUniswapV2Router02 _router, IUniswapV2Factory _factory) IMdexService(_controller){
        ROUTER = _router;
        FACTORY = _factory;
    }

    function uniSwap(address token1, address token2, uint256 amount, address reciever) internal {
        address[] memory path = new address[](2);
        path[0] = token1;
        path[1] = token2;

        IERC20(token1).transferFrom(msg.sender, address(this), amount);
        IERC20(token1).approve(address(ROUTER), amount);
        uint256[] memory amountOutMin = ROUTER.getAmountsOut(amount, path);
        ROUTER.swapTokensForExactTokens(amountOutMin[1], amount, path, reciever, block.timestamp);
    }

    function _swap(address token1, address token2, uint256 amount, address reciever) internal override {
        require(msg.sender == address(controller), "Only Controller Call");
        uniSwap(token1, token2, amount, reciever);
    }

}
