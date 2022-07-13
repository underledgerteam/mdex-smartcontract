const hre = require('hardhat');

module.exports = async function main() {
  const MdexController = await hre.ethers.getContractFactory('MdexController');
  const mdexController = await MdexController.deploy(
    process.env.MULTISIG_ADDRESS,
  );

  await mdexController.deployed();
};
