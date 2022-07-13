const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    // AddressProvider
    const AddressProvider = await hre.ethers.getContractFactory('AddressProvider');
    provider = await AddressProvider.deploy(deployer);
    await provider.deployed();

    // Registry
    const Registry = await hre.ethers.getContractFactory("Registry");
    registry = await Registry.deploy(provider.address);
    await registry.deployed();

    // Pool Info
    const PoolInfo = await ethers.getContractFactory("MdexCurveFiPool");
    poolInfo = await PoolInfo.deploy(provider.address);
    await poolInfo.deployed();

    // LP Token
    const CurveToken = await ethers.getContractFactory("CurveToken");
    curveToken = await CurveToken.deploy("MTOKEN", "MTK");
    await curveToken.deployed();

    await provider.set_address(0, registry.address);
    await provider.add_new_id(poolInfo.address, "MdexCurveFiPool Getters");

    console.log("Curve AddressProvider deployed to:", provider.address);
    console.log("Curve Registry deployed to:", registry.address);
    console.log("Curve PoolInfo deployed to:", poolInfo.address);
    console.log("Curve LP Token deployed to:", curveToken.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});  