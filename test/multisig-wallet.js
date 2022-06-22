const { ethers } = require("hardhat");
const { expect } = require("chai");
const { ethers: etherJS } = require("ethers");

function printSeperator() {
  console.log("\n====================================\n");
}

describe("TEST MULTISIG WALLET", () => {
  let user1, user2, user3, user4, other;
  let multiSigWallet;
  let mockERC20;
  beforeEach(async () => {
    [user1, user2, user3, user4, other] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWallet.deploy([
      user1.address,
      user2.address,
      user3.address,
      user4.address,
    ]);

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy();

    await mockERC20.deployed();
    await multiSigWallet.deployed();
  });
  printSeperator();
  console.log("Deploy Multi-Sig Wallet");
  printSeperator();

  it("Use Case #1 : Should Recieve Native Token", async () => {
    await other.sendTransaction({
      to: multiSigWallet.address,
      value: etherJS.utils.parseEther("1.0"),
    });

    await expect(
      await multiSigWallet.provider.getBalance(multiSigWallet.address)
    ).to.equal("1000000000000000000");
  });

  it("Use Case #2 : Should submit withdraw eth transaction", async () => {
    await expect(
      await multiSigWallet
        .connect(user1)
        .submitWithdrawETHTransaction(other.address, "1000000000000000000")
    )
      .to.emit(multiSigWallet, "WithdrawETH")
      .withArgs(user1.address, other.address, "1000000000000000000");
  });

  it("Use Case #3 : Should submit withdraw erc20 transaction", async () => {
    await expect(
      await multiSigWallet
        .connect(user1)
        .submitWithdrawERC20Transaction(
          other.address,
          mockERC20.address,
          "1000000000000000000"
        )
    )
      .to.emit(multiSigWallet, "WithdrawERC20")
      .withArgs(user1.address, other.address, "1000000000000000000");
  });

  it("Use Case #4 : Should confirm transaction", async () => {
    await multiSigWallet
      .connect(user1)
      .submitWithdrawETHTransaction(other.address, "1000000000000000000");

    await expect(multiSigWallet.connect(user1).confirmTransaction(1))
      .to.emit(multiSigWallet, "ConfirmTransaction")
      .withArgs(user1.address, 1);
  });

  it("Use Case #5 : Should Execute Transaction with ETH", async () => {
    await other.sendTransaction({
      to: multiSigWallet.address,
      value: etherJS.utils.parseEther("1.0"),
    });

    await multiSigWallet
      .connect(user1)
      .submitWithdrawETHTransaction(other.address, "1000000000000000000");

    await multiSigWallet.connect(user1).confirmTransaction(1);
    await multiSigWallet.connect(user2).confirmTransaction(1);
    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);

    await expect(multiSigWallet.connect(user1).executeTransaction(1))
      .to.emit(multiSigWallet, "ExecuteTransaction")
      .withArgs(user1.address, 1);
  });

  it("Use Case #6 : Should Execute Transaction with ERC20", async () => {
    await other.sendTransaction({
      to: multiSigWallet.address,
      value: etherJS.utils.parseEther("1.0"),
    });

    await mockERC20.mint(multiSigWallet.address, "1000000000000000000");

    await multiSigWallet
      .connect(user1)
      .submitWithdrawERC20Transaction(
        other.address,
        mockERC20.address,
        "1000000000000000000"
      );

    await multiSigWallet.connect(user1).confirmTransaction(1);
    await multiSigWallet.connect(user2).confirmTransaction(1);
    await multiSigWallet.connect(user3).confirmTransaction(1);
    await multiSigWallet.connect(user4).confirmTransaction(1);

    await expect(multiSigWallet.connect(user1).executeTransaction(1))
      .to.emit(multiSigWallet, "ExecuteTransaction")
      .withArgs(user1.address, 1);
  });
});
