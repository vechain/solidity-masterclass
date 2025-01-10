import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ReentrancyVulnerable", function () {
  async function deployContractsFixture() {
    const [owner, user1, attacker] = await hre.ethers.getSigners();

    // Deploy the vulnerable contract
    const ReentrancyVulnerable = await hre.ethers.getContractFactory(
      "ReentrancyVulnerable"
    );
    const vulnerableContract = await ReentrancyVulnerable.deploy();

    // Deploy the attacker contract
    const Attacker = await hre.ethers.getContractFactory("Attacker");
    const attackerContract = await Attacker.connect(attacker).deploy(
      await vulnerableContract.getAddress()
    );

    return { vulnerableContract, attackerContract, owner, user1, attacker };
  }

  describe("Normal Operations", function () {
    it("Should allow deposits", async function () {
      const { vulnerableContract, user1 } = await loadFixture(
        deployContractsFixture
      );
      const depositAmount = hre.ethers.parseEther("1");

      await vulnerableContract.connect(user1).deposit({ value: depositAmount });
      expect(await vulnerableContract.balances(user1.address)).to.equal(
        depositAmount
      );
    });

    it("Should allow legitimate withdrawals", async function () {
      const { vulnerableContract, user1 } = await loadFixture(
        deployContractsFixture
      );
      const depositAmount = hre.ethers.parseEther("1");

      await vulnerableContract.connect(user1).deposit({ value: depositAmount });
      const initialBalance = await hre.ethers.provider.getBalance(
        user1.address
      );

      await vulnerableContract.connect(user1).withdrawAll();

      const finalBalance = await hre.ethers.provider.getBalance(user1.address);
      expect(await vulnerableContract.balances(user1.address)).to.equal(0);
      // Balance should be higher (minus gas costs)
      expect(finalBalance).to.be.gt(
        initialBalance - hre.ethers.parseEther("0.1")
      ); // Accounting for gas
    });

    it("Should revert withdrawal with no balance", async function () {
      const { vulnerableContract, user1 } = await loadFixture(
        deployContractsFixture
      );
      await expect(
        vulnerableContract.connect(user1).withdrawAll()
      ).to.be.revertedWith("No balance to withdraw");
    });
  });

  describe("Reentrancy Attack", function () {
    it("Should be vulnerable to reentrancy attack", async function () {
      const { vulnerableContract, attackerContract, owner, attacker } =
        await loadFixture(deployContractsFixture);

      // First, let's fund the vulnerable contract with some ETH
      await vulnerableContract
        .connect(owner)
        .deposit({ value: hre.ethers.parseEther("10") });

      // Initial balances
      const initialVulnerableBalance = await hre.ethers.provider.getBalance(
        await vulnerableContract.getAddress()
      );
      const initialAttackerBalance = await hre.ethers.provider.getBalance(
        attacker.address
      );

      // Perform the attack with 1 ETH
      const attackAmount = hre.ethers.parseEther("1");
      await attackerContract.connect(attacker).attack({ value: attackAmount });

      // Withdraw stolen funds
      await attackerContract.connect(attacker).withdraw();

      // Final balances
      const finalVulnerableBalance = await hre.ethers.provider.getBalance(
        await vulnerableContract.getAddress()
      );
      const finalAttackerBalance = await hre.ethers.provider.getBalance(
        attacker.address
      );

      // Verify the attack was successful
      expect(finalVulnerableBalance).to.be.lt(initialVulnerableBalance);
      expect(finalAttackerBalance).to.be.gt(initialAttackerBalance);

      console.log("Drained amount: ", hre.ethers.formatEther(finalAttackerBalance - initialAttackerBalance));
    });

    it("Should drain more than deposited amount", async function () {
      const { vulnerableContract, attackerContract, owner, attacker } =
        await loadFixture(deployContractsFixture);

      // Fund vulnerable contract with 10 ETH
      await vulnerableContract
        .connect(owner)
        .deposit({ value: hre.ethers.parseEther("10") });

      // Attack with 1 ETH
      const attackAmount = hre.ethers.parseEther("1");
      await attackerContract.connect(attacker).attack({ value: attackAmount });

      // Check attacker contract balance
      const stolenAmount = await attackerContract.getBalance();

      // Verify stolen amount is greater than initial deposit
      expect(stolenAmount).to.be.gt(attackAmount);
    });

    it("Should allow multiple victims to be attacked", async function () {
      const { vulnerableContract, attackerContract, user1, attacker } =
        await loadFixture(deployContractsFixture);

      // User1 deposits 5 ETH
      await vulnerableContract
        .connect(user1)
        .deposit({ value: hre.ethers.parseEther("5") });

      // Attack with 1 ETH
      const attackAmount = hre.ethers.parseEther("1");
      await attackerContract.connect(attacker).attack({ value: attackAmount });

      // Try to withdraw as user1 (should fail or get less)
      await expect(vulnerableContract.connect(user1).withdrawAll()).to.be
        .reverted;
    });

    it("Should update attack amount correctly", async function () {
      const { attackerContract, attacker } = await loadFixture(
        deployContractsFixture
      );

      const attackAmount = hre.ethers.parseEther("1");
      await attackerContract.connect(attacker).attack({ value: attackAmount });

      expect(await attackerContract.attackAmount()).to.equal(attackAmount);
    });
  });

  describe("Contract State", function () {
    it("Should track balances correctly before attack", async function () {
      const { vulnerableContract, user1 } = await loadFixture(
        deployContractsFixture
      );

      const depositAmount = hre.ethers.parseEther("1");
      await vulnerableContract.connect(user1).deposit({ value: depositAmount });

      expect(await vulnerableContract.balances(user1.address)).to.equal(
        depositAmount
      );
    });

    it("Should show zero balances after successful withdrawal", async function () {
      const { vulnerableContract, user1 } = await loadFixture(
        deployContractsFixture
      );

      const depositAmount = hre.ethers.parseEther("1");
      await vulnerableContract.connect(user1).deposit({ value: depositAmount });
      await vulnerableContract.connect(user1).withdrawAll();

      expect(await vulnerableContract.balances(user1.address)).to.equal(0);
    });
  });
});
