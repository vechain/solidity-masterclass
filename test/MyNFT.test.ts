import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { MyNFT } from "../typechain-types";

describe("MyNFT", function () {
  async function deployMyNFTFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = await MyNFT.deploy();

    return { nft, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      const { nft } = await loadFixture(deployMyNFTFixture);
      expect(await nft.name()).to.equal("RareItem");
      expect(await nft.symbol()).to.equal("RI");
    });

    it("Should start with token ID 0", async function () {
      const { nft } = await loadFixture(deployMyNFTFixture);
      expect(await nft.nextTokenId()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow users to mint NFTs", async function () {
      const { nft, user1 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      expect(await nft.ownerOf(0)).to.equal(user1.address);
    });

    it("Should increment token ID after minting", async function () {
      const { nft, user1 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      expect(await nft.nextTokenId()).to.equal(1);
    });

    it("Should emit Transfer event on mint", async function () {
      const { nft, user1 } = await loadFixture(deployMyNFTFixture);
      await expect(nft.connect(user1).mint())
        .to.emit(nft, "Transfer")
        .withArgs(hre.ethers.ZeroAddress, user1.address, 0);
    });

    it("Should allow minting multiple NFTs", async function () {
      const { nft, user1 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await nft.connect(user1).mint();
      expect(await nft.ownerOf(0)).to.equal(user1.address);
      expect(await nft.ownerOf(1)).to.equal(user1.address);
      expect(await nft.nextTokenId()).to.equal(2);
    });
  });

  describe("Transfers", function () {
    it("Should allow owner to transfer NFT", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await nft.connect(user1).transferFrom(user1.address, user2.address, 0);
      expect(await nft.ownerOf(0)).to.equal(user2.address);
    });

    it("Should emit Transfer event on transfer", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await expect(nft.connect(user1).transferFrom(user1.address, user2.address, 0))
        .to.emit(nft, "Transfer")
        .withArgs(user1.address, user2.address, 0);
    });

    it("Should not allow non-owner to transfer NFT", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await expect(
        nft.connect(user2).transferFrom(user1.address, user2.address, 0)
      ).to.be.reverted;
    });
  });

  describe("Approvals", function () {
    it("Should allow owner to approve transfer", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await nft.connect(user1).approve(user2.address, 0);
      expect(await nft.getApproved(0)).to.equal(user2.address);
    });

    it("Should allow approved address to transfer NFT", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await nft.connect(user1).approve(user2.address, 0);
      await nft.connect(user2).transferFrom(user1.address, user2.address, 0);
      expect(await nft.ownerOf(0)).to.equal(user2.address);
    });

    it("Should emit Approval event", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await expect(nft.connect(user1).approve(user2.address, 0))
        .to.emit(nft, "Approval")
        .withArgs(user1.address, user2.address, 0);
    });

    it("Should not allow non-owner to approve transfer", async function () {
      const { nft, user1, user2 } = await loadFixture(deployMyNFTFixture);
      await nft.connect(user1).mint();
      await expect(
        nft.connect(user2).approve(user2.address, 0)
      ).to.be.reverted;
    });
  });
}); 