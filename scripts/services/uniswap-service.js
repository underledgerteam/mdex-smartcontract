const hre = require('hardhat');
require('dotenv').config();

module.exports = async function main() {
  const MdexUniSwapService = await hre.ethers.getContractFactory(
    'MdexUniSwapService',
  );
  const mdexUniSwapService = await MdexUniSwapService.deploy(
    process.env.CONTROLLER,
    process.env.UNISWAP_ROUTER,
    process.env.UNISWAP_FACTORY,
  );

  await mdexUniSwapService.deployed();
};
