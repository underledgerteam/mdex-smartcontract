const { expect } = require("chai");
const { ethers } = require("hardhat");

function printSeperator() {
  console.log("\n====================================\n");
}

describe("TEST SWAP TOKEN", () => {
  let deployer;
  let provider;
  let registry;
  let poolInfo;
  let curveToken;
  let token1;
  let token2;
  let pool2;
  let user1;
  let mdexController;
  let mdexCurveService;
  let user2;
  let user3;
  let user4;
  let user5;
  let rateInfo =
    "0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000";
  beforeEach(async () => {
    [deployer, user1, user2, user3, user4, user5] = await ethers.getSigners();
    const n_coin = 2;
    const poolName = "Pool2AB";

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

    const PoolInfo = await ethers.getContractFactory("MdexCurveFiPool");
    poolInfo = await PoolInfo.deploy(provider.address);
    await poolInfo.deployed();

    await provider.set_address(0, registry.address);
    await provider.add_new_id(poolInfo.address, "MdexCurveFiPool Getters");

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

    await token1.mint(user1.address, "20000000000000000000000");
    await token2.mint(user1.address, "10000000000000000000000");

    await curveToken.connect(deployer).set_minter(pool2.address);

    await token1
      .connect(user1)
      .approve(pool2.address, "10000000000000000000000");
    await token2
      .connect(user1)
      .approve(pool2.address, "10000000000000000000000");

    await pool2
      .connect(user1)
      .add_liquidity(["10000000000000000000000", "10000000000000000000000"], 0);

    await registry
      .connect(user1)
      .add_pool_without_underlying(
        pool2.address,
        n_coin,
        curveToken.address,
        rateInfo,
        18,
        18,
        false,
        false,
        poolName
      );

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWallet.deploy(
      [
        user1.address,
        user2.address,
        user3.address,
        user4.address,
        user5.address,
      ],
      token2.address
    );

    await multiSigWallet.deployed();

    const MdexController = await ethers.getContractFactory("MdexController");
    mdexController = await MdexController.deploy(multiSigWallet.address);

    const MdexCurveService = await ethers.getContractFactory(
      "MdexCurveService"
    );

    await mdexController.deployed();

    mdexCurveService = await MdexCurveService.deploy(
      mdexController.address,
      registry.address
    );

    await mdexCurveService.deployed();
  });

  it("Use Case #1 : Should Swap Token", async () => {
    await token1
      .connect(user1)
      .approve(mdexController.address, "10000000000000000000000");

    await mdexController
      .connect(user1)
      .swap(
        token1.address,
        token2.address,
        "10000000000000000000000",
        mdexCurveService.address
      );

    await expect(await token1.balanceOf(user1.address)).to.equal("0");
    await expect(await token2.balanceOf(user1.address)).to.gt("0");
    await expect(await token2.balanceOf(multiSigWallet.address)).to.gt("0");
  });

  it("Use Case #2 : Shouldn't call service if not controller", async () => {
    await token1
      .connect(user1)
      .approve(mdexController.address, "10000000000000000000000");

    await expect(
      mdexCurveService
        .connect(user1)
        .swap(
          token1.address,
          token2.address,
          "10000000000000000000000",
          user1.address
        )
    ).to.revertedWith("Not Controller");
  });
});
