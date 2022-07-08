const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    // Deploy Token
    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy("Latte", "LAT");

    await token.mint(deployer, 100000000);

    console.log("Token deployed to:", token.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});