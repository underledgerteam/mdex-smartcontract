const hre = require('hardhat');

module.exports = async function main() {
  const MdexBestRateQuery = await hre.ethers.getContractFactory(
    'MdexBestRateQuery',
  );
  const mdexBestRateQuery = await MdexBestRateQuery.deploy();

  await mdexBestRateQuery.deployed();
};
