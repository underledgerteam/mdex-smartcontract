const hre = require('hardhat');
require('dotenv').config();

module.exports = async function main() {
  const MdexCurveService = await hre.ethers.getContractFactory(
    'MdexCurveService',
  );
  const mdexCurveService = await MdexCurveService.deploy(
    process.env.CONTROLLER,
    process.env.CURVE_SERVICE,
  );

  await mdexCurveService.deployed();
};
