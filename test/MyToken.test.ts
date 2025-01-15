import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { MyToken } from "../typechain-types";

describe("MyToken", function () {
  async function deployMyTokenFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy();

    return { token, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      const { token } = await loadFixture(deployMyTokenFixture);
      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
    });

    it("Should set the right decimals", async function () {
      const { token } = await loadFixture(deployMyTokenFixture);
      expect(await token.decimals()).to.equal(18);
    });

    it("Should assign the total supply to the owner", async function () {
      const { token, owner } = await loadFixture(deployMyTokenFixture);
      const totalSupply = await token.totalSupply();
      expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, user1 } = await loadFixture(deployMyTokenFixture);
      const transferAmount = hre.ethers.parseEther("100");

      await token.transfer(user1.address, transferAmount);
      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
    });

    it("Should emit Transfer event", async function () {
      const { token, owner, user1 } = await loadFixture(deployMyTokenFixture);
      const transferAmount = hre.ethers.parseEther("100");

      await expect(token.transfer(user1.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, user1.address, transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { token, owner, user1 } = await loadFixture(deployMyTokenFixture);
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await expect(
        token.connect(user1).transfer(owner.address, 1)
      ).to.be.reverted;

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for delegated transfer", async function () {
      const { token, owner, user1 } = await loadFixture(deployMyTokenFixture);
      const approveAmount = hre.ethers.parseEther("100");

      await token.approve(user1.address, approveAmount);
      expect(await token.allowance(owner.address, user1.address)).to.equal(approveAmount);
    });

    it("Should emit Approval event", async function () {
      const { token, owner, user1 } = await loadFixture(deployMyTokenFixture);
      const approveAmount = hre.ethers.parseEther("100");

      await expect(token.approve(user1.address, approveAmount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, user1.address, approveAmount);
    });

    it("Should allow for delegated transfer", async function () {
      const { token, owner, user1, user2 } = await loadFixture(deployMyTokenFixture);
      const approveAmount = hre.ethers.parseEther("100");

      await token.approve(user1.address, approveAmount);
      await token.connect(user1).transferFrom(owner.address, user2.address, approveAmount);

      expect(await token.balanceOf(user2.address)).to.equal(approveAmount);
      expect(await token.allowance(owner.address, user1.address)).to.equal(0);
    });

    it("Should fail delegated transfer if spender doesn't have enough allowance", async function () {
      const { token, owner, user1, user2 } = await loadFixture(deployMyTokenFixture);
      const approveAmount = hre.ethers.parseEther("100");
      const transferAmount = hre.ethers.parseEther("101");

      await token.approve(user1.address, approveAmount);
      await expect(
        token.connect(user1).transferFrom(owner.address, user2.address, transferAmount)
      ).to.be.reverted;
    });
  });
}); 