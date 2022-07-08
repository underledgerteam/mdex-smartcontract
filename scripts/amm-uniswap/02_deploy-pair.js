const hre = require("hardhat");

async function main() {
    const factoryAddress = "0x8d4a32680361206C56a09DbadB048337Fe0fdF10"
    const routerAddress = "0xB7f3bcBB70664491D42aaE295F74ec0e0ec77848"
    const token0Address = ""
    const token1Address = ""

    const maxUint = hre.ethers.constants.MaxUint256;

    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.attach(factoryAddress);

    const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
    const router = await Router.attach(routerAddress);

    // Create Pair
    await factory.createPair(token0Address, token1Address);
    console.log("Pair deploy success");

    const pairAddress = await factory.getPair(token0Address, token1Address);
    // console.log("Pair deployed to:", pairAddress);

    // Approve token for adding pool liquidity
    const Token = await hre.ethers.getContractFactory("Token");
    const token0 = await Token.attach(token0Address);
    const token1 = await Token.attach(token1Address);

    await token0.approve(router.address, maxUint);
    await token1.approve(router.address, maxUint);

    // Add liquidity
    const amount = 100000;
    await router.addLiquidity(
        token0Address,
        token1Address,
        amount,
        amount,
        amount,
        amount,
        deployer,
        maxUint,
    );
    console.log("Add pool liquidity success");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});