import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { OZAccessControl } from "../typechain-types";

describe("OZAccessControl", function () {
  // Define role identifiers as constants
  const DEFAULT_ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const ADMIN_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ADMIN_ROLE"));
  const MINTER_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("MINTER_ROLE")
  );

  async function deployOZAccessControlFixture() {
    const [owner, minter, otherAccount] = await hre.ethers.getSigners();
    const OZAccessControl = await hre.ethers.getContractFactory(
      "OZAccessControl"
    );
    const accessControl = await OZAccessControl.deploy();

    return { accessControl, owner, minter, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set deployer as default admin and admin role", async function () {
      const { accessControl, owner } = await loadFixture(
        deployOZAccessControlFixture
      );
      expect(await accessControl.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to
        .be.true;
      expect(await accessControl.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should not set deployer as minter by default", async function () {
      const { accessControl, owner } = await loadFixture(
        deployOZAccessControlFixture
      );
      expect(await accessControl.hasRole(MINTER_ROLE, owner.address)).to.be
        .false;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to add minter", async function () {
      const { accessControl, minter } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      expect(await accessControl.hasRole(MINTER_ROLE, minter.address)).to.be
        .true;
    });

    it("Should emit RoleGranted event when adding minter", async function () {
      const { accessControl, owner, minter } = await loadFixture(
        deployOZAccessControlFixture
      );
      await expect(accessControl.addMinter(minter.address))
        .to.emit(accessControl, "RoleGranted")
        .withArgs(MINTER_ROLE, minter.address, owner.address);
    });

    it("Should allow admin to remove minter", async function () {
      const { accessControl, minter } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      await accessControl.removeMinter(minter.address);
      expect(await accessControl.hasRole(MINTER_ROLE, minter.address)).to.be
        .false;
    });

    it("Should emit RoleRevoked event when removing minter", async function () {
      const { accessControl, owner, minter } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      await expect(accessControl.removeMinter(minter.address))
        .to.emit(accessControl, "RoleRevoked")
        .withArgs(MINTER_ROLE, minter.address, owner.address);
    });

    it("Should not allow non-admin to add minter", async function () {
      const { accessControl, minter, otherAccount } = await loadFixture(
        deployOZAccessControlFixture
      );
      await expect(
        accessControl.connect(otherAccount).addMinter(minter.address)
      ).to.be.reverted;
    });

    it("Should not allow non-admin to remove minter", async function () {
      const { accessControl, minter, otherAccount } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      await expect(
        accessControl.connect(otherAccount).removeMinter(minter.address)
      ).to.be.reverted;
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to call setSpecialValue", async function () {
      const { accessControl } = await loadFixture(deployOZAccessControlFixture);
      await expect(accessControl.setSpecialValue(42)).not.to.be.reverted;
    });

    it("Should not allow non-admin to call setSpecialValue", async function () {
      const { accessControl, otherAccount } = await loadFixture(
        deployOZAccessControlFixture
      );
      await expect(accessControl.connect(otherAccount).setSpecialValue(42)).to
        .be.reverted;
    });

    it("Should allow minter to call mintToken", async function () {
      const { accessControl, minter, otherAccount } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      await expect(
        accessControl.connect(minter).mintToken(otherAccount.address, 100)
      ).not.to.be.reverted;
    });

    it("Should not allow non-minter to call mintToken", async function () {
      const { accessControl, otherAccount } = await loadFixture(
        deployOZAccessControlFixture
      );
      await expect(
        accessControl.connect(otherAccount).mintToken(otherAccount.address, 100)
      ).to.be.reverted;
    });
  });

  describe("Role Renunciation", function () {
    it("Should allow minter to renounce their role", async function () {
      const { accessControl, minter } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      await accessControl
        .connect(minter)
        .renounceRole(MINTER_ROLE, minter.address);
      expect(await accessControl.hasRole(MINTER_ROLE, minter.address)).to.be
        .false;
    });

    it("Should not allow minter to renounce role for others", async function () {
      const { accessControl, minter, otherAccount } = await loadFixture(
        deployOZAccessControlFixture
      );
      await accessControl.addMinter(minter.address);
      await expect(
        accessControl
          .connect(minter)
          .renounceRole(MINTER_ROLE, otherAccount.address)
      ).to.be.reverted;
    });
  });
});
