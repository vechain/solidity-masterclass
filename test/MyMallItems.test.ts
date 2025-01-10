import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { MyMallItems } from "../typechain-types";

describe("MyMallItems", function () {
  // Constants for item IDs
  const BATTERIES = 0;
  const SMARTWATCH = 1;
  const BATTERIES_AMOUNT = 10;
  const SMARTWATCH_AMOUNT = 1;

  async function deployMyMallItemsFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const MyMallItems = await hre.ethers.getContractFactory("MyMallItems");
    const mallItems = await MyMallItems.deploy();

    return { mallItems, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right URI", async function () {
      const { mallItems } = await loadFixture(deployMyMallItemsFixture);
      expect(await mallItems.uri(0)).to.equal(
        "https://mall.example/api/item/{id}.json"
      );
    });

    it("Should mint initial items to deployer", async function () {
      const { mallItems, owner } = await loadFixture(deployMyMallItemsFixture);
      expect(await mallItems.balanceOf(owner.address, BATTERIES)).to.equal(
        BATTERIES_AMOUNT
      );
      expect(await mallItems.balanceOf(owner.address, SMARTWATCH)).to.equal(
        SMARTWATCH_AMOUNT
      );
    });
  });

  describe("Transfers", function () {
    it("Should allow single token transfer", async function () {
      const { mallItems, owner, user1 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await mallItems.safeTransferFrom(
        owner.address,
        user1.address,
        SMARTWATCH,
        1,
        "0x"
      );
      expect(await mallItems.balanceOf(user1.address, SMARTWATCH)).to.equal(1);
      expect(await mallItems.balanceOf(owner.address, SMARTWATCH)).to.equal(0);
    });

    it("Should allow batch token transfer", async function () {
      const { mallItems, owner, user1 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await mallItems.safeBatchTransferFrom(
        owner.address,
        user1.address,
        [BATTERIES, SMARTWATCH],
        [5, 1],
        "0x"
      );
      expect(await mallItems.balanceOf(user1.address, BATTERIES)).to.equal(5);
      expect(await mallItems.balanceOf(user1.address, SMARTWATCH)).to.equal(1);
      expect(await mallItems.balanceOf(owner.address, BATTERIES)).to.equal(5);
      expect(await mallItems.balanceOf(owner.address, SMARTWATCH)).to.equal(0);
    });

    it("Should emit TransferSingle event", async function () {
      const { mallItems, owner, user1 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await expect(
        mallItems.safeTransferFrom(
          owner.address,
          user1.address,
          BATTERIES,
          1,
          "0x"
        )
      )
        .to.emit(mallItems, "TransferSingle")
        .withArgs(owner.address, owner.address, user1.address, BATTERIES, 1);
    });

    it("Should emit TransferBatch event", async function () {
      const { mallItems, owner, user1 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await expect(
        mallItems.safeBatchTransferFrom(
          owner.address,
          user1.address,
          [BATTERIES, SMARTWATCH],
          [5, 1],
          "0x"
        )
      )
        .to.emit(mallItems, "TransferBatch")
        .withArgs(
          owner.address,
          owner.address,
          user1.address,
          [BATTERIES, SMARTWATCH],
          [5, 1]
        );
    });

    it("Should fail if sender doesn't have enough balance", async function () {
      const { mallItems, owner, user1, user2 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await expect(
        mallItems
          .connect(user1)
          .safeTransferFrom(user1.address, user2.address, BATTERIES, 1, "0x")
      ).to.be.reverted;
    });
  });

  describe("Approvals", function () {
    it("Should allow approval for all", async function () {
      const { mallItems, owner, user1 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await mallItems.setApprovalForAll(user1.address, true);
      expect(await mallItems.isApprovedForAll(owner.address, user1.address)).to
        .be.true;
    });

    it("Should emit ApprovalForAll event", async function () {
      const { mallItems, owner, user1 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await expect(mallItems.setApprovalForAll(user1.address, true))
        .to.emit(mallItems, "ApprovalForAll")
        .withArgs(owner.address, user1.address, true);
    });

    it("Should allow approved operator to transfer tokens", async function () {
      const { mallItems, owner, user1, user2 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await mallItems.setApprovalForAll(user1.address, true);
      await mallItems
        .connect(user1)
        .safeTransferFrom(owner.address, user2.address, BATTERIES, 1, "0x");
      expect(await mallItems.balanceOf(user2.address, BATTERIES)).to.equal(1);
    });

    it("Should not allow non-approved operator to transfer tokens", async function () {
      const { mallItems, owner, user1, user2 } = await loadFixture(
        deployMyMallItemsFixture
      );
      await expect(
        mallItems
          .connect(user1)
          .safeTransferFrom(owner.address, user2.address, BATTERIES, 1, "0x")
      ).to.be.reverted;
    });
  });

  describe("Balances", function () {
    it("Should return correct single balance", async function () {
      const { mallItems, owner } = await loadFixture(deployMyMallItemsFixture);
      expect(await mallItems.balanceOf(owner.address, BATTERIES)).to.equal(
        BATTERIES_AMOUNT
      );
    });

    it("Should return correct batch balances", async function () {
      const { mallItems, owner } = await loadFixture(deployMyMallItemsFixture);
      const balances = await mallItems.balanceOfBatch(
        [owner.address, owner.address],
        [BATTERIES, SMARTWATCH]
      );
      expect(balances[0]).to.equal(BATTERIES_AMOUNT);
      expect(balances[1]).to.equal(SMARTWATCH_AMOUNT);
    });

    it("Should revert batch balance check if arrays length mismatch", async function () {
      const { mallItems, owner } = await loadFixture(deployMyMallItemsFixture);
      await expect(
        mallItems.balanceOfBatch([owner.address], [BATTERIES, SMARTWATCH])
      ).to.be.reverted;
    });
  });
});
