require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-vyper");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const {
  PRIVATE_KEY,
  RINKEBY_URL,
  ROPSTEN_URL,
  KOVAN_URL,
  GOERLI_URL,
  ETHERSCAN_API_KEY,
} = process.env;

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    ropsten: {
      url: `${ROPSTEN_URL}`,
      accounts: [PRIVATE_KEY],
      chainId: 3,
    },
    rinkeby: {
      url: `${RINKEBY_URL}`,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    kovan: {
      url: `${KOVAN_URL}`,
      accounts: [PRIVATE_KEY],
      chainId: 42,
    },
    goerli: {
      url: `${GOERLI_URL}`,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      ropsten: `${ETHERSCAN_API_KEY}`,
      rinkeby: `${ETHERSCAN_API_KEY}`,
      kovan: `${ETHERSCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  vyper: {
    compilers: [
      { version: "0.2.1" },
      { version: "0.3.0" },
      { version: "0.3.3" },
    ],
  },
  solidity: {
    compilers: [
      {
        version: "0.8.11",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.5.0",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.11",
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
};
