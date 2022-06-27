const hre = require("hardhat");

async function main() {
    await hre.ethers.getSigners();

    const Pool2Assets = await hre.ethers.getContractFactory("2pool");
    // const pool2 = await Pool2Assets.attach("0xBd1dDC4Db02b5D938A58CFB1Be956b2D80C73ee7");
    const pool2 = await Pool2Assets.attach("0xd0a543915E104214A11b8b1b796EfA05485A2875");
    
    const add_liquidity = await pool2.add_liquidity([1,1], 2);
    console.log("add_liquidity :", add_liquidity);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
