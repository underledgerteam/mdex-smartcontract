const uniswapService = require('./uniswap-service');

async function main() {
  await uniswapService();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
