const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    // LP token
    const MockWETH = await hre.ethers.getContractFactory('Token');
    weth = await MockWETH.deploy('MockWETH', 'WETH');
    await weth.deployed();

    // Factory
    const Factory = await hre.ethers.getContractFactory('UniswapV2Factory');
    factory = await Factory.deploy(deployer);
    await factory.deployed();

    // Router
    const Router = await hre.ethers.getContractFactory('UniswapV2Router02');
    router = await Router.deploy(factory.address, weth.address);
    await router.deployed();

    console.log("LP Token deployed to:", weth.address);
    console.log("Uniswap Factory deployed to:", factory.address);
    console.log("Uniswap Router deployed to:", router.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});  