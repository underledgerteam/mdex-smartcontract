const hre = require("hardhat");

async function main() {
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy();
  const Token = await hre.ethers.getContractFactory("Token");
  // You can pass a new argument if you want
  const token = await Token.deploy("token", "tk");

  await mockToken.deployed();
  await token.deployed();

  console.log("MockERC20 deployed to:", mockToken.address);
  console.log("Token deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
