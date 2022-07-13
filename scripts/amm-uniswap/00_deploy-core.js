const hre = require('hardhat');

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;

  // LP token
  const MdexLP = await hre.ethers.getContractFactory('Token');
  const mdexLP = await MdexLP.deploy('MDEX-LP', 'MDEX');
  await mdexLP.deployed();

  // Factory
  const Factory = await hre.ethers.getContractFactory('UniswapV2Factory');
  const factory = await Factory.deploy(deployer);
  await factory.deployed();

  // Router
  const Router = await hre.ethers.getContractFactory('UniswapV2Router02');
  const router = await Router.deploy(factory.address, mdexLP.address);
  await router.deployed();

  console.log('LP Token deployed to:', mdexLP.address);
  console.log('Uniswap Factory deployed to:', factory.address);
  console.log('Uniswap Router deployed to:', router.address);

  // LP Token deployed to: 0x0f9ae404693bD1Cef32E09D1A0fC177e9f5f06Cf
  // Uniswap Factory deployed to: 0xC5d1087c591D61ce9e386f12729562F961E39CB1
  // Uniswap Router deployed to: 0x1E35e4F59aF5eAD9100b0152129836A5E1d73e37
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
