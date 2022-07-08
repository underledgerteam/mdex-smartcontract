const hre = require("hardhat");

async function main() {
    const factoryAddress = "0x8d4a32680361206C56a09DbadB048337Fe0fdF10"
    const token0Address = "0x1596CCd3cB3C7368bfBDF13c4055c94B17C04f90"
    const token1Address = "0xf07faBedAD957518a1bC01A9E6D3968E759A0A04"

    // Pair
    const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.attach(factoryAddress);

    await factory.createPair(token0Address, token1Address);
    console.log("Pair deploy success");

    const pairAddress = await factory.getPair(token0Address, token1Address);
    console.log("Pair deployed to:", pairAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});