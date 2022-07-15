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
| `Mdex Controller` | Ethereum Rinkeby Testnet | **0xC346a421101D6a21FC4dFfE60F3a2c4Dd6188974**|
| `Latte Token` | Ethereum Rinkeby Testnet | **0xe842709994fd15889C77749806F7D4C0e9775D41**|
| `Mocha Token` | Ethereum Rinkeby Testnet | **0x985623ec22501b59954B5Fe6557C8Fe518B00B67**|
| `Test Token` | Ethereum Rinkeby Testnet | **0x3FFc03F05D1869f493c7dbf913E636C6280e0ff9**|
| `Uniswap Router` | Ethereum Rinkeby Testnet | **0x1E35e4F59aF5eAD9100b0152129836A5E1d73e37**|
| `Uniswap Factory` | Ethereum Rinkeby Testnet | **0xC5d1087c591D61ce9e386f12729562F961E39CB1**|
| `Uniswap Service` | Ethereum Rinkeby Testnet | **0x44011Bf2077eC44Ea646730e246Cd66A15Aef5ed**|
| `Curve Service` | Ethereum Rinkeby Testnet | **0xbc1A3Eee159a768feD46Bdd4B9D5F7E1F13256ed**|
| `Multisig Wallet` | Ethereum Rinkeby Testnet | **0x99c0Ca1094b09B4f8ea4A6dc3Bd2F5B26639B642**|
| `Mdex Best Rate Query` | Ethereum Rinkeby Testnet | **0xECA4c9390F438Eb3De75eC60B36ac1d99833D872**|


