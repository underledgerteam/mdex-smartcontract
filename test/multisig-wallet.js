const { ethers } = require("hardhat");
const { expect } = require("chai");

function printSeperator() {
  console.log("\n====================================\n");
}

describe("TEST MULTISIG WALLET", () => {
  let user1, user2, user3, user4, user5, other;
  let multiSigWallet;
  let mockERC20;
  beforeEach(async () => {
    [user1, user2, user3, user4, user5, other] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy();

    await mockERC20.deployed();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWallet.deploy(
      [
        user1.address,
        user2.address,
        user3.address,
        user4.address,
        user5.address,
      ],
      mockERC20.address
    );

    await multiSigWallet.deployed();
  });
  printSeperator();
  console.log("Deploy Multi-Sig Wallet");
  printSeperator();

  it("Test Case #1 : Should submit withdraw transaction", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await expect(
      await multiSigWallet
        .connect(user1)
        .submitWithdrawTransaction(other.address, "1000000000000000000")
    )
      .to.emit(multiSigWallet, "WithdrawERC20")
      .withArgs(user1.address, other.address, "1000000000000000000");
  });

  it("Test Case #2 : Should confirm transaction", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");
    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await expect(multiSigWallet.connect(user2).confirmTransaction(1))
      .to.emit(multiSigWallet, "ConfirmTransaction")
      .withArgs(user2.address, 1);
  });

  it("Test Case #3 : Should Execute Transaction with ERC20", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user2).confirmTransaction(1);
    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);

    await expect(multiSigWallet.connect(user1).executeTransaction(1))
      .to.emit(multiSigWallet, "ExecuteTransaction")
      .withArgs(user1.address, 1);
  });

  it("Test Case #4 : Shouldn't submit transaction if not member", async () => {
    await expect(
      multiSigWallet
        .connect(other)
        .submitWithdrawTransaction(user1.address, "10000000")
    ).to.revertedWith("not team");
  });

  it("Test Case #5 :  Shouldn't submit transaction if value more than balance", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await expect(
      multiSigWallet
        .connect(user1)
        .submitWithdrawTransaction(user1.address, "2000000000000000000")
    ).to.revertedWith("erc20 insufficient balance");
  });

  it("Test Case #6 : Shouldn't confirm transaction if not member", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");
    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await expect(
      multiSigWallet.connect(other).confirmTransaction(1)
    ).to.revertedWith("not team");
  });

  it("Test Case #7 :  Shouldn't confirm transaction if transaction executed", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);
    await multiSigWallet.connect(user5).confirmTransaction(1);

    await multiSigWallet.connect(user1).executeTransaction(1);

    await expect(
      multiSigWallet.connect(user2).confirmTransaction(1)
    ).to.revertedWith("tx already executed");
  });

  it("Test Case #8 : Shouldn't confirm transaction if confirmed", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user2).confirmTransaction(1);

    await expect(
      multiSigWallet.connect(user2).confirmTransaction(1)
    ).to.revertedWith("tx already confirmed");
  });

  it("Test Case #9 : Shouldn't confirm transaction if you own transaction", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await expect(
      multiSigWallet.connect(user1).confirmTransaction(1)
    ).to.revertedWith("owner cannot vote confirm");
  });

  it("Test Case #10 : Shouldn't execute transaction if not member", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);
    await multiSigWallet.connect(user5).confirmTransaction(1);

    await expect(
      multiSigWallet.connect(other).executeTransaction(1)
    ).to.revertedWith("not team");
  });

  it("Test Case #11 : Shouldn't execute transaction if transaction executed", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);
    await multiSigWallet.connect(user5).confirmTransaction(1);

    await multiSigWallet.connect(user1).executeTransaction(1);

    await expect(
      multiSigWallet.connect(user2).executeTransaction(1)
    ).to.revertedWith("tx already executed");
  });

  it("Test Case #12 : Shouldn't execute transaction if number of confirmation < 3", async () => {
    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);

    await expect(
      multiSigWallet.connect(user2).executeTransaction(1)
    ).to.revertedWith("cannot execute tx");
  });
});
