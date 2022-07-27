const hre = require('hardhat');
require('dotenv').config();

module.exports = async function main() {
  const MdexCurveService = await hre.ethers.getContractFactory(
    'MdexCurveService',
  );
  const mdexCurveService = await MdexCurveService.deploy(
    '0xe2e0DfA2dC80d847F6B6B9D67FE0fDa07B10EE5a',
  );

  await mdexCurveService.deployed();
};
