const hre = require('hardhat');

module.exports = async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;

  // Deploy Token
  const Token = await hre.ethers.getContractFactory('Token');
  const token = await Token.deploy('Latte', 'LAT');

  await token.mint(deployer, '10000000000000000000000000');
};

// npx hardhat verify --network rinkeby 0xCB1F577a935a0c433BF4f28E0c66dD89127F6C3d "0x99c0Ca1094b09B4f8ea4A6dc3Bd2F5B26639B642"
