const { ethers } = require('hardhat');
const hre = require('hardhat');
require('dotenv').config();
// Curve AddressProvider deployed to: 0x60C5B111CC4Fa2FeFca04E3a039088a8D0216532
// Curve Registry deployed to: 0x51d7122E7a6307c5685B2fCFa9856D02702C09E6
// Curve PoolInfo deployed to: 0xEfC2d6a06c6363F89dB5e24B573085b2fE7F9273
// Curve LP Token deployed to: 0xE8103f32a9F07ca2bdB7271fE0a93441ef33Ef2e

async function main() {
  const CurveToken = await ethers.getContractFactory('CurveToken');
  curveToken = await CurveToken.deploy('MDEX-LP', 'LP-TOKEN');
  await curveToken.deployed();

  const registryAddress = '0x51d7122E7a6307c5685B2fCFa9856D02702C09E6';
  const curveTokenAddress = curveToken.address;

  const token0Name = 'LAT';
  const token1Name = 'MCH';
  const token0Address = '0xe842709994fd15889C77749806F7D4C0e9775D41';
  const token1Address = '0x985623ec22501b59954B5Fe6557C8Fe518B00B67';

  const maxUint = hre.ethers.constants.MaxUint256;
  const rateInfo =
    '0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000';

  const accounts = await hre.ethers.getSigners();
  const deployer = '0xe9D2e454968379426BB6b0a92ffaf20A60ff579d';

  const Pool = await hre.ethers.getContractFactory('Pool2Assets');
  pool = await Pool.deploy(
    deployer,
    [token0Address, token1Address],
    curveTokenAddress,
    400000,
    1,
  );

  await pool.deployed();

  console.log(
    `Curve Pool ${token0Name}-${token1Name} deployed to: ${pool.address}`,
  );

  // Add new pool to registry
  const Registry = await hre.ethers.getContractFactory('Registry');
  const registry = await Registry.attach(registryAddress);

  await registry.add_pool_without_underlying(
    pool.address,
    2,
    curveTokenAddress,
    rateInfo,
    18,
    18,
    false,
    false,
    `Pool ${token0Name}-${token1Name}`,
  );

  console.log('Add pool to registry sucess');

  // Mint token to deployer
  const amount = '2000000000000000000000000';

  const Token = await hre.ethers.getContractFactory('Token');
  const token0 = await Token.attach(token0Address);
  const token1 = await Token.attach(token1Address);

  await curveToken.connect(accounts[0]).set_minter(pool.address);

  await token0.mint(deployer, amount);
  await token1.mint(deployer, amount);
  console.log('Mint token to deployer success');

  await token0.approve(pool.address, maxUint);
  await token1.approve(pool.address, maxUint);
  console.log('Approve token success');

  // Add liquidity
  await pool.add_liquidity(
    ['2000000000000000000000000', '2000000000000000000000000'],
    0,
  );
  console.log('Add liquidity to pool sucess');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
