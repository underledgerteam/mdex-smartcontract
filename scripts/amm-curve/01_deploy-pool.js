const hre = require("hardhat");

async function main() {
    const registryAddress = "0x7C23caDb8d18Bc619136d5B39E4b360be515E609";
    const curveTokenAddress = "0x0f3ee443391C66F92ed723b8ff3B532fe127e91D";

    const token0Name = "LAT";
    const token1Name = "MCH";
    const token0Address = "0x908881aE6B521065e44F0B4EF948f8C74a5C3e17";
    const token1Address = "0x1596CCd3cB3C7368bfBDF13c4055c94B17C04f90";

    const maxUint = hre.ethers.constants.MaxUint256;
    const rateInfo = "0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000"

    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    const Pool = await hre.ethers.getContractFactory("Pool2Assets");
    pool = await Pool.deploy(
        deployer,
        [token0Address, token1Address],
        curveTokenAddress,
        400000,
        1
    );

    await pool.deployed();

    console.log(`Curve Pool ${token0Name}-${token1Name} deployed to: ${pool.address}`);

    // Add new pool to registry
    const Registry = await hre.ethers.getContractFactory("Registry");
    const registry = await Registry.attach(registryAddress);

    await registry.add_pool_without_underlying(
        pool.address, 2, curveTokenAddress, rateInfo,
        18, 18, false, false, `Pool ${token0Name}-${token1Name}`
    );

    console.log("Add pool to registry sucess");

    // Mint token to deployer
    const amount = 1000000000000;
    const initialLiquidity = amount / 2;

    const Token = await hre.ethers.getContractFactory("Token");
    const token0 = await Token.attach(token0Address);
    const token1 = await Token.attach(token1Address);

    await token0.mint(deployer, amount);
    await token1.mint(deployer, amount)
    console.log("Mint token to deployer success");

    await token0.approve(pool.address, maxUint);
    await token1.approve(pool.address, maxUint);
    console.log("Approve token success");

    // Add liquidity
    await pool.add_liquidity([initialLiquidity, initialLiquidity], 0);
    console.log("Add liquidity to pool sucess");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});