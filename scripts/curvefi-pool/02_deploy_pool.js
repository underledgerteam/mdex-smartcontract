// Deploy own CurveFi liquidity pools
const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const accounts = await hre.ethers.getSigners();
    const deployer = accounts[0].address;

    var poolData;
    var coins = []
    
    try {
        const data = fs.readFileSync("contracts/vyper/curvefi/pools/2pools/pooldata.json", 'utf8');
        poolData = JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
    
    const lpToken = poolData.lp_constructor;

    const CurveToken = await hre.ethers.getContractFactory("CurveToken");
    const curveToken = await CurveToken.deploy(lpToken.name, lpToken.symbol);
    await curveToken.deployed();

    poolData.coins.forEach(coin => {
        coins.push(coin.underlying_address);
    });

    const Pool2Assets = await hre.ethers.getContractFactory("2pool");
    const pool2 = await Pool2Assets.deploy(
        deployer,
        coins,
        curveToken.address,
        400000,
        10 * 10
    );

    await pool2.deployed();

    console.log("CurveToken deployed to:", curveToken.address);
    console.log("Pool deployed to:", pool2.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});