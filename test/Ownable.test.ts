import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { Ownable } from "../typechain-types";

describe("Ownable", function () {
  async function deployOwnableFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const Ownable = await hre.ethers.getContractFactory("OwnableSimple");
    const ownable = await Ownable.deploy();

    return { ownable, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set deployer as owner", async function () {
      const { ownable, owner } = await loadFixture(deployOwnableFixture);
      expect(await ownable.owner()).to.equal(owner.address);
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to call ownerFunction", async function () {
      const { ownable } = await loadFixture(deployOwnableFixture);
      await expect(ownable.ownerFunction()).not.to.be.reverted;
    });

    it("Should revert when non-owner calls ownerFunction", async function () {
      const { ownable, user1 } = await loadFixture(deployOwnableFixture);
      await expect(ownable.connect(user1).ownerFunction())
        .to.be.revertedWith("Access restricted to the owner");
    });
  });

  describe("Ownership Transfer", function () {
    it("Should allow owner to transfer ownership", async function () {
      const { ownable, owner, user1 } = await loadFixture(deployOwnableFixture);
      await ownable.transferOwnership(user1.address);
      expect(await ownable.owner()).to.equal(user1.address);
    });

    it("Should revert when non-owner tries to transfer ownership", async function () {
      const { ownable, user1, user2 } = await loadFixture(deployOwnableFixture);
      await expect(ownable.connect(user1).transferOwnership(user2.address))
        .to.be.revertedWith("Access restricted to the owner");
    });

    it("Should revert when transferring ownership to zero address", async function () {
      const { ownable } = await loadFixture(deployOwnableFixture);
      await expect(ownable.transferOwnership(hre.ethers.ZeroAddress))
        .to.be.revertedWith("New owner cannot be the zero address");
    });

    it("Should allow new owner to call ownerFunction after transfer", async function () {
      const { ownable, user1 } = await loadFixture(deployOwnableFixture);
      await ownable.transferOwnership(user1.address);
      await expect(ownable.connect(user1).ownerFunction()).not.to.be.reverted;
    });

    it("Should prevent old owner from calling ownerFunction after transfer", async function () {
      const { ownable, owner, user1 } = await loadFixture(deployOwnableFixture);
      await ownable.transferOwnership(user1.address);
      await expect(ownable.ownerFunction())
        .to.be.revertedWith("Access restricted to the owner");
    });

    it("Should allow chained ownership transfers", async function () {
      const { ownable, owner, user1, user2 } = await loadFixture(deployOwnableFixture);
      await ownable.transferOwnership(user1.address);
      await ownable.connect(user1).transferOwnership(user2.address);
      expect(await ownable.owner()).to.equal(user2.address);
    });
  });
}); 