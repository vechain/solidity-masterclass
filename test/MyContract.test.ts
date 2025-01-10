import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("MyContract", function () {
  async function deployContractFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();

    const LibMath = await hre.ethers.getContractFactory("LibMath");
    const libMath = await LibMath.deploy();

    // Deploy MyContract (no need to link LibStrings since it uses internal functions but we need to link LibMath because it has external functions and that means it is not part of the bytecode of MyContract)
    const MyContract = await hre.ethers.getContractFactory("MyContract", {
      libraries: {
        LibMath: await libMath.getAddress(),
      },
    });

    const myContract = await MyContract.deploy();

    return { myContract, owner, user1, user2 };
  }

  describe("String Comparison", function () {
    it("Should correctly identify cool items", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Test exact match
      expect(await myContract.isCoolItem("CoolItem")).to.be.true;

      // Test non-matching items
      expect(await myContract.isCoolItem("NotCoolItem")).to.be.false;
      expect(await myContract.isCoolItem("coolitem")).to.be.false; // Case sensitive
      expect(await myContract.isCoolItem("Cool Item")).to.be.false; // Space matters
    });

    it("Should handle empty strings", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      expect(await myContract.isCoolItem("")).to.be.false;
    });

    it("Should handle special characters", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      expect(await myContract.isCoolItem("CoolItem!")).to.be.false;
      expect(await myContract.isCoolItem("CoolItem123")).to.be.false;
      expect(await myContract.isCoolItem("CoolItem_")).to.be.false;
    });
  });

  describe("String Prefix Check", function () {
    it("Should correctly identify items with 'Sword' prefix", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Test valid prefixes
      expect(await myContract.itemHasPrefix("Sword")).to.be.true;
      expect(await myContract.itemHasPrefix("SwordOfLight")).to.be.true;
      expect(await myContract.itemHasPrefix("Sword123")).to.be.true;
      expect(await myContract.itemHasPrefix("Sword_of_Destiny")).to.be.true;
    });

    it("Should reject items without 'Sword' prefix", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Test invalid prefixes
      expect(await myContract.itemHasPrefix("MySword")).to.be.false;
      expect(await myContract.itemHasPrefix("sword")).to.be.false; // Case sensitive
      expect(await myContract.itemHasPrefix("SWORD")).to.be.false;
      expect(await myContract.itemHasPrefix("The Sword")).to.be.false;
    });

    it("Should handle empty strings", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      expect(await myContract.itemHasPrefix("")).to.be.false;
    });

    it("Should handle strings shorter than prefix", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      expect(await myContract.itemHasPrefix("Swo")).to.be.false;
      expect(await myContract.itemHasPrefix("S")).to.be.false;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle unicode characters", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Test with unicode characters
      expect(await myContract.isCoolItem("CoolItem™")).to.be.false;
      expect(await myContract.itemHasPrefix("Sword™")).to.be.true;
    });

    it("Should handle very long strings", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Create a very long string
      const longString = "Sword" + "x".repeat(1000);
      expect(await myContract.itemHasPrefix(longString)).to.be.true;
    });

    it("Should handle whitespace", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Test with various whitespace combinations
      expect(await myContract.isCoolItem(" CoolItem")).to.be.false;
      expect(await myContract.isCoolItem("CoolItem ")).to.be.false;
      expect(await myContract.isCoolItem(" CoolItem ")).to.be.false;

      expect(await myContract.itemHasPrefix(" Sword")).to.be.false;
      expect(await myContract.itemHasPrefix("Sword OfLight")).to.be.true;
    });
  });

  describe("Library Integration", function () {
    it("Should use library for all string operations", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Verify both functions work as expected, demonstrating library integration
      expect(await myContract.isCoolItem("CoolItem")).to.be.true;
      expect(await myContract.itemHasPrefix("SwordOfLight")).to.be.true;

      // Verify consistent behavior across functions
      expect(await myContract.isCoolItem("NotCoolItem")).to.be.false;
      expect(await myContract.itemHasPrefix("NotASword")).to.be.false;
    });
  });

  describe("Math Operations", function () {
    it("Should correctly double values", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      expect(await myContract.doubleValue(0)).to.equal(0);
      expect(await myContract.doubleValue(1)).to.equal(2);
      expect(await myContract.doubleValue(100)).to.equal(200);
      expect(await myContract.doubleValue(2n ** 128n)).to.equal(2n ** 129n);
    });

    it("Should correctly half values", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      expect(await myContract.halfValue(0)).to.equal(0);
      expect(await myContract.halfValue(2)).to.equal(1);
      expect(await myContract.halfValue(3)).to.equal(1); // Integer division
      expect(await myContract.halfValue(100)).to.equal(50);
      expect(await myContract.halfValue(2n ** 128n)).to.equal(2n ** 127n);
    });

    it("Should handle edge cases", async function () {
      const { myContract } = await loadFixture(deployContractFixture);

      // Max uint256 divided by 2
      const maxUint256 = 2n ** 256n - 1n;
      expect(await myContract.halfValue(maxUint256)).to.equal(maxUint256 / 2n);

      // Test that doubling a large number doesn't overflow
      const largeNumber = 2n ** 255n - 1n;
      expect(await myContract.doubleValue(largeNumber)).to.equal(
        largeNumber * 2n
      );
    });
  });
});
