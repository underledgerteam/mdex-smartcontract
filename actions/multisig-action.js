const { ethers } = require('ethers');
const ABI = require('./multisig-abi.json');

const updateStateFn = async (context, event) => {
  const privateKey = await context.secrets.get('PRIVATE_KEY');

  const CONTRACT_ADDRESS = '';

  const provider = ethers.getDefaultProvider(ethers.providers.getNetwork(4));
  const wallet = new ethers.Wallet(privateKey, provider);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  await contract.updateTransaction();
};
// Function must be exported
module.exports = { updateStateFn };
