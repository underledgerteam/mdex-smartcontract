const hre = require('hardhat');

module.exports = async function main() {
  // Deploy Token
  const MdexCrossChainSwap = await hre.ethers.getContractFactory(
    'MdexCrossChainSwap',
  );
  const mdexCrossChainSwap = await MdexCrossChainSwap.deploy();

  await mdexCrossChainSwap.deployed();
};
