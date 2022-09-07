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

| `Mdex Controller` | Optimism Goerli Testnet | **0x93C2DCE0cc0B9aFA001834c76d26180CE6FC367d**|
| `Multisig Wallet` | Optimism Goerli Testnet | **0xB2468b3CF340D748774bb0139F835b1cFDA86F40**|
| `Latte Token` | Optimism Goerli Testnet | **0x938d9CE22e4F76499b3382d6182e232D16BB410c**|
| `Mocha Token` | Optimism Goerli Testnet | **0x575beC1c6072F1A5102472ac642db17df60F2B6c**|
| `Test Token` | Optimism Goerli Testnet | **0x68Db1c8d85C09d546097C65ec7DCBFF4D6497CbF**|
| `Uniswap Router` | Optimism Goerli Testnet | **0x20f5A827a91Cb2BfB89B6aedbA035dbA95D49a18**|
| `Uniswap Factory` | Optimism Goerli Testnet | **0xCc34AF1A337c6eab33e696Fc4b6E2516585F164A**|
| `Uniswap Service` | Optimism Goerli Testnet | **0x9dc23763731BCBa39765E299917081348d95375b**|
| `Curve Service` | Optimism Goerli Testnet | **0x4602986D33C30fD7765E729cc7f30256919D6FCc**|
| `Mdex Best Rate Query` | Optimism Goerli Testnet | **0x6E4dF47ac4570789586d4E3dbc9423f3CeD5AC73**|
| `Mdex Cross Chain Swap` | Optimism Goerli Testnet | **0x817F5b1eE8a26C80Fab7E74E58AE88e5b4DaB615**|
| `Connext Service` | Optimism Goerli Testnet | **0xa73937b2a823a4154e09193250558f0503509DdD**|



