const mdexCrossChainSwap = require('./mdex-cross-chain-swap');
const connextService = require('./connext-service');

async function main() {
  await mdexCrossChainSwap();
  await connextService();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
