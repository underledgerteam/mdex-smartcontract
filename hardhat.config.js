require('dotenv').config();

require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-vyper');
require('xdeployer');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const DEFAULT_ENDPOINT = 'http://localhost:8545';
const DEFAULT_PRIVATE_KEY =
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const {
  PRIVATE_KEY,
  RINKEBY_URL,
  ROPSTEN_URL,
  KOVAN_URL,
  GOERLI_URL,
  OPTIMISIM_GOERLI_URL,
  ETHERSCAN_API_KEY,
} = process.env;

const kovanEndpoint = KOVAN_URL || DEFAULT_ENDPOINT;
const kovanPrivateKey = PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const ropstenEndpoint = ROPSTEN_URL || DEFAULT_ENDPOINT;
const ropstenPrivateKey = PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const goerliEndpoint = GOERLI_URL || DEFAULT_ENDPOINT;
const goerliPrivateKey = PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const rinkebyEndpoint = RINKEBY_URL || DEFAULT_ENDPOINT;
const rinkebyPrivateKey = PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

const optimismGoerliEndpoint = OPTIMISIM_GOERLI_URL || DEFAULT_ENDPOINT;
const optimismGoerliPrivateKey = PRIVATE_KEY || DEFAULT_PRIVATE_KEY;

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    ropsten: {
      url: ropstenEndpoint,
      accounts: [ropstenPrivateKey],
      chainId: 3,
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      url: rinkebyEndpoint,
      accounts: [rinkebyPrivateKey],
      chainId: 4,
    },
    kovan: {
      url: kovanEndpoint,
      accounts: [kovanPrivateKey],
      chainId: 42,
    },
    goerli: {
      url: goerliEndpoint,
      accounts: [goerliPrivateKey],
      chainId: 5,
    },
    optimismGoerli: {
      url: optimismGoerliEndpoint,
      accounts: [optimismGoerliPrivateKey],
      chainId: 420,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: {
      ropsten: `${ETHERSCAN_API_KEY}`,
      rinkeby: `${ETHERSCAN_API_KEY}`,
      kovan: `${ETHERSCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
      optimismGoerli: `${ETHERSCAN_API_KEY}`,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  vyper: {
    compilers: [
      { version: '0.2.1' },
      { version: '0.3.0' },
      { version: '0.3.3' },
    ],
  },
  solidity: {
    compilers: [
      {
        version: '0.8.15',
      },
      {
        version: '0.8.11',
      },
      {
        version: '0.8.0',
      },
      {
        version: '0.5.0',
      },
      {
        version: '0.5.16',
      },
      {
        version: '0.6.11',
      },
      {
        version: '0.6.12',
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
  },
  xdeploy: {
    contract: 'MdexCrossChainSwap',
    constructorArgsPath: '',
    salt: 'DEPLOY_MDEX_asdasdasd_BY_PRAasdsdMES_sadasdasdasxxxxaadasdasdasd',
    signer: PRIVATE_KEY,
    networks: ['rinkeby', 'goerli'],
    rpcUrls: [RINKEBY_URL, GOERLI_URL],
    gasLimit: 1.2 * 10 ** 7,
  },

  // view more Document: https://github.com/pcaversaccio/xdeployer
};
