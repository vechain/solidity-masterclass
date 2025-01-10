import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ReentrancySafe", function () {
  async function deployContractsFixture() {
    const [owner, user1, attacker] = await hre.ethers.getSigners();

    // Deploy the safe contract
    const ReentrancySafe = await hre.ethers.getContractFactory(
      "ReentrancySafe"
    );
    const safeContract = await ReentrancySafe.deploy();

    // Deploy the attacker contract (reusing the same attacker contract)
    const Attacker = await hre.ethers.getContractFactory("Attacker");
    const attackerContract = await Attacker.connect(attacker).deploy(
      await safeContract.getAddress()
    );

    return { safeContract, attackerContract, owner, user1, attacker };
  }

  describe("Normal Operations", function () {
    it("Should allow deposits", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = hre.ethers.parseEther("1");

      await safeContract.connect(user1).deposit({ value: depositAmount });
      expect(await safeContract.balances(user1.address)).to.equal(
        depositAmount
      );
    });

    it("Should allow legitimate withdrawals", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = hre.ethers.parseEther("1");

      await safeContract.connect(user1).deposit({ value: depositAmount });
      const initialBalance = await hre.ethers.provider.getBalance(
        user1.address
      );

      await safeContract.connect(user1).withdrawAll();

      const finalBalance = await hre.ethers.provider.getBalance(user1.address);
      expect(await safeContract.balances(user1.address)).to.equal(0);
      expect(finalBalance).to.be.gt(
        initialBalance - hre.ethers.parseEther("0.1")
      ); // Accounting for gas
    });

    it("Should revert withdrawal with no balance", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      await expect(
        safeContract.connect(user1).withdrawAll()
      ).to.be.revertedWith("No balance");
    });

    it("Should handle multiple deposits correctly", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = hre.ethers.parseEther("1");

      await safeContract.connect(user1).deposit({ value: depositAmount });
      await safeContract.connect(user1).deposit({ value: depositAmount });

      expect(await safeContract.balances(user1.address)).to.equal(
        depositAmount * 2n
      );
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should prevent reentrancy attack", async function () {
      const { safeContract, attackerContract, owner, attacker } =
        await loadFixture(deployContractsFixture);

      // Fund the safe contract
      await safeContract
        .connect(owner)
        .deposit({ value: hre.ethers.parseEther("10") });

      // Initial balances
      const initialSafeBalance = await hre.ethers.provider.getBalance(
        await safeContract.getAddress()
      );

      // Attempt the attack - should fail
      const attackAmount = hre.ethers.parseEther("1");
      await expect(
        attackerContract.connect(attacker).attack({ value: attackAmount })
      ).to.be.reverted;

      // Final balance should be unchanged except for the attacker's deposit
      const finalSafeBalance = await hre.ethers.provider.getBalance(
        await safeContract.getAddress()
      );
      expect(finalSafeBalance).to.equal(initialSafeBalance);
    });

    it("Should maintain correct balances after failed attack", async function () {
      const { safeContract, attackerContract, owner, attacker } =
        await loadFixture(deployContractsFixture);

      // Initial setup
      await safeContract
        .connect(owner)
        .deposit({ value: hre.ethers.parseEther("10") });
      const attackAmount = hre.ethers.parseEther("1");

      // Attempt attack - should fail
      await expect(
        attackerContract.connect(attacker).attack({ value: attackAmount })
      ).to.be.reverted;

      // Check balances - only the deposit should be recorded
      expect(
        await safeContract.balances(await attackerContract.getAddress())
      ).to.equal(0);
      expect(await safeContract.balances(owner.address)).to.equal(
        hre.ethers.parseEther("10")
      );
    });

    it("Should allow normal withdrawal after failed attack", async function () {
      const { safeContract, attackerContract, user1, attacker } =
        await loadFixture(deployContractsFixture);

      // Setup
      const userDeposit = hre.ethers.parseEther("5");
      await safeContract.connect(user1).deposit({ value: userDeposit });

      // Attempt attack - should fail
      const attackAmount = hre.ethers.parseEther("1");
      await expect(
        attackerContract.connect(attacker).attack({ value: attackAmount })
      ).to.be.reverted;

      // User should still be able to withdraw
      await safeContract.connect(user1).withdrawAll();
      expect(await safeContract.balances(user1.address)).to.equal(0);
    });

    it("Should handle concurrent legitimate withdrawals", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = hre.ethers.parseEther("1");

      // Deposit and withdraw multiple times
      await safeContract.connect(user1).deposit({ value: depositAmount });
      await safeContract.connect(user1).withdrawAll();
      await safeContract.connect(user1).deposit({ value: depositAmount });
      await safeContract.connect(user1).withdrawAll();

      expect(await safeContract.balances(user1.address)).to.equal(0);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero value deposits", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      await safeContract.connect(user1).deposit({ value: 0 });
      expect(await safeContract.balances(user1.address)).to.equal(0);
    });

    it("Should handle multiple deposits", async function () {
      const { safeContract, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = hre.ethers.parseEther("1");

      await safeContract.connect(user1).deposit({ value: depositAmount });
      await safeContract.connect(user1).deposit({ value: depositAmount });

      expect(await safeContract.balances(user1.address)).to.equal(
        depositAmount * 2n
      );
    });
  });
});
