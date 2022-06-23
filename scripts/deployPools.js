// Deploy own CurveFi liquidity pools
const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    const AddressProvider = await hre.ethers.getContractFactory("AddressProvider");
    const provider = await AddressProvider.deploy(deployer);
    await provider.deployed();

    const PoolInfo = await hre.ethers.getContractFactory("PoolInfo");
    const poolInfo = await PoolInfo.deploy(provider.address);
    await poolInfo.deployed();

    await provider.add_new_id(poolInfo.address, "PoolInfo Getters");
    
    console.log("AddressProvider deployed to:", provider.address);
    console.log("PoolInfo deployed to:", poolInfo.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});