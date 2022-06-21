//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {

    constructor() ERC20("Mock Token", "MTK")  {}

    function mint(address to, uint256 amountss) external {
        _mint(to, amountss);
    }

}