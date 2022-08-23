# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
# Contract Address

Contract Addres for using in our project

| Name | Chain | Address |
| --- | --- | --- |
| `Mdex Controller` | Ethereum Rinkeby Testnet | **0x8207ef2260e98b5Ae3aF0419c22c5a76e9267De2**|
| `Latte Token` | Ethereum Rinkeby Testnet | **0xe842709994fd15889C77749806F7D4C0e9775D41**|
| `Mocha Token` | Ethereum Rinkeby Testnet | **0x985623ec22501b59954B5Fe6557C8Fe518B00B67**|
| `Test Token` | Ethereum Rinkeby Testnet | **0x3FFc03F05D1869f493c7dbf913E636C6280e0ff9**|
| `Uniswap Router` | Ethereum Rinkeby Testnet | **0x55849B87FeF28093d493f6a3f507d01C55C0643D**|
| `Uniswap Factory` | Ethereum Rinkeby Testnet | **0xe207e4dcABc40459f877CEFA2Ff790f711B9d541**|
| `Uniswap Service` | Ethereum Rinkeby Testnet | **0xC808999584831F68B5E1a34D07Cb9D8D636cDb66**|
| `Curve Service` | Ethereum Rinkeby Testnet | **0x49534faFD4AeDc6FE84b9e0a80Aaf68E57851D01**|
| `Multisig Wallet` | Ethereum Rinkeby Testnet | **0x2A5e8342EEcD3DCD22D4720A6f3B7dDFCA129868**|
| `Mdex Best Rate Query` | Ethereum Rinkeby Testnet | **0x92CA3294eB72b212e53Eb4b900d0D691f9cd4F4d**|
| `Mdex Cross Chain Swap` | Ethereum Rinkeby Testnet | **0xB5c1737663bc4f5D23E4d0c0971e3C275E1aa736**|
| `Connext Service` | Ethereum Rinkeby Testnet | **0x4201aDfcE227Aff382500EF0d10F4137216A9613**|
| `Mdex Controller` | Ethereum Goerli Testnet | **0xe2e0DfA2dC80d847F6B6B9D67FE0fDa07B10EE5a**|
| `Multisig Wallet` | Ethereum Goerli Testnet | **0x5D9b61B62D27E310FE8679a76d27a558bD0E016D**|
| `Latte Token` | Ethereum Goerli Testnet | **0xfd88678C924B140c84232Ea907d5a60D709B8f9a**|
| `Mocha Token` | Ethereum Goerli Testnet | **0xa3C91B4e8051c155AE080A6A16B4923F6FB711f3**|
| `Test Token` | Ethereum Goerli Testnet | **0x26FE8a8f86511d678d031a022E48FfF41c6a3e3b**|
| `Uniswap Router` | Ethereum Goerli Testnet | **0x1027c51FE7DD497B858dfDE8b3548f73F29728Ce**|
| `Uniswap Factory` | Ethereum Goerli Testnet | **0x94573E7509cDAE7CB28A089b40e50a40c52E119D**|
| `Uniswap Service` | Ethereum Goerli Testnet | **0x650146d2aC4DE67E2852772ba93698ab67fBdA27**|
| `Curve Service` | Ethereum Goerli Testnet | **0x8f9c1e92F973409C26b01B49210783600D2Ca463**|
| `Mdex Best Rate Query` | Ethereum Goerli Testnet | **0xd19C6F58B9D06C0C3198993Ee9C34C08BA57195e**|
| `Mdex Cross Chain Swap` | Ethereum Goerli Testnet | **0x2594986EF5DDF0CdBfF07F2376AF1aD5397770d7**|
| `Connext Service` | Ethereum Goerli Testnet | **0x92f09CDaE15671B33b4dE7816Ab0d45A904B41A9**|


