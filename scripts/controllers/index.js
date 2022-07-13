const mdexController = require('./mdex-controller');

async function main() {
  await mdexController();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
