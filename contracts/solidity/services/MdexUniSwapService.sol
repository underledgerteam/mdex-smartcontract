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

    function uniSwap(address tokenIn, address tokenOut, uint256 amount, address reciever) internal {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenIn).approve(address(ROUTER), amount);
        uint256[] memory amountOutMin = ROUTER.getAmountsOut(amount, path);
        ROUTER.swapTokensForExactTokens(amountOutMin[1], amount, path, reciever, block.timestamp);
    }

    function _swap(address tokenIn, address tokenOut, uint256 amount, address reciever) internal override {
        require(msg.sender == address(controller), "Only Controller Call");
        uniSwap(tokenIn, tokenOut, amount, reciever);
    }

    function _getDestinationReturnAmount(address tokenIn, address tokenOut, uint256 amount) internal override view returns(uint256 token2Amount){
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        uint256[] memory amounts = ROUTER.getAmountsOut(amount, path);
        token2Amount = amounts[1];
    }


}
