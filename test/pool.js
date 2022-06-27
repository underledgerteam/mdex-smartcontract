const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { ethers: etherJS } = require("ethers");

function printSeperator() {
  console.log("\n====================================\n");
}

describe("TEST POOL", () => {
  let deployer;
  let provider;
  let registry;
  let poolInfo;
  let curveToken;
  let token1;
  let token2;
  let pool2;
  let user1;
  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token1 = await MockERC20.deploy();
    token2 = await MockERC20.deploy();

    await token1.deployed();
    await token2.deployed();

    const AddressProvider = await ethers.getContractFactory("AddressProvider");

    provider = await AddressProvider.deploy(deployer.address);
    await provider.deployed();

    const Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy(provider.address);
    await registry.deployed();

    const PoolInfo = await ethers.getContractFactory("PoolInfo");
    poolInfo = await PoolInfo.deploy(provider.address);
    await poolInfo.deployed();

    await provider.add_new_id(registry.address, "PoolInfo Getters");
    await provider.add_new_id(poolInfo.address, "PoolInfo Getters");

    const CurveToken = await ethers.getContractFactory("CurveToken");
    curveToken = await CurveToken.deploy("MTOKEN", "MTK");
    await curveToken.deployed();

    const Pool2 = await ethers.getContractFactory("Pool2");
    pool2 = await Pool2.deploy(
      deployer.address,
      [token1.address, token2.address],
      curveToken.address,
      400000,
      1
    );

    await pool2.deployed();
  });

  printSeperator();
  console.log("Deploy Pool ");
  printSeperator();

  it("Use Case #1 : Should Add Liquidity", async () => {
    await token1.mint(user1.address, "10000000000000000000000");
    await token2.mint(user1.address, "10000000000000000000000");
    await curveToken.connect(deployer).set_minter(pool2.address);

    await token1
      .connect(user1)
      .approve(pool2.address, "10000000000000000000000");
    await token2
      .connect(user1)
      .approve(pool2.address, "10000000000000000000000");

    await expect(
      pool2
        .connect(user1)
        .add_liquidity(
          ["10000000000000000000000", "10000000000000000000000"],
          0
        )
    )
      .to.emit(curveToken, "Transfer")
      .withArgs("0x0000000000000000000000000000000000000000", user1.address, 1);
  });

  //   it("Use Case #2 : Should Swap", async () => {
  //     await token1.mint(user1.address, "20000000000000000000000");
  //     await token2.mint(user1.address, "10000000000000000000000");
  //     await curveToken.connect(deployer).set_minter(pool2.address);

  //     await token1
  //       .connect(user1)
  //       .approve(pool2.address, "20000000000000000000000");
  //     await token2
  //       .connect(user1)
  //       .approve(pool2.address, "10000000000000000000000");

  //     await pool2
  //       .connect(user1)
  //       .add_liquidity(["10000000000000000000000", "10000000000000000000000"], 0);

  //     await pool2.connect(user1).exchange(2, 1, "100000", "100");
  //   });
});
