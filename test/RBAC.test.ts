import { expect } from "chai";
import hre from "hardhat";
import { RBAC } from "../typechain-types";

describe("RBAC", function () {
  async function deployRBACFixture() {
    // Get signers for different roles
    const [owner, user1, user2] = await hre.ethers.getSigners();

    const RBAC = await hre.ethers.getContractFactory("RBAC");
    const rbac: RBAC = await RBAC.connect(owner).deploy();

    return { rbac, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set deployer as Admin", async function () {
      const { rbac, owner } = await deployRBACFixture();
      expect(await rbac.roles(owner.address)).to.equal(1); // Role.Admin is 1
    });
  });

  describe("Role Assignment", function () {
    it("Should revert when non-admin tries to assign role", async function () {
      const { rbac, user1, user2 } = await deployRBACFixture();
      await expect(
        rbac.connect(user1).assignRole(user2.address, 1)
      ).to.be.revertedWith("Access restricted to Admins only");
    });


    it("Should allow admin to assign User role", async function () {
      const { rbac, owner, user1 } = await deployRBACFixture();
      await rbac.assignRole(user1.address, 1); // Role.User is 1
      expect(await rbac.roles(user1.address)).to.equal(1);
    });

    it("Should allow admin to assign Admin role", async function () {
      const { rbac, user1 } = await deployRBACFixture();
      await rbac.assignRole(user1.address, 0); // Role.Admin is 0
      expect(await rbac.roles(user1.address)).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to call adminFunction", async function () {
      const { rbac, owner } = await deployRBACFixture();
      await expect(rbac.adminFunction()).not.to.be.reverted;
    });

    it("Should revert when non-admin calls adminFunction", async function () {
      const { rbac, user1 } = await deployRBACFixture();
      await expect(rbac.connect(user1).adminFunction()).to.be.revertedWith(
        "Access restricted to Admins only"
      );
    });

    it("Should allow user to call userFunction", async function () {
      const { rbac, owner, user1 } = await deployRBACFixture();
      await rbac.assignRole(user1.address, 2); // Assign User role
      await expect(rbac.connect(user1).userFunction()).not.to.be.reverted;
    });

    it("Should revert when non-user calls userFunction", async function () {
      const { rbac, user1 } = await deployRBACFixture();
      await expect(rbac.connect(user1).userFunction()).to.be.revertedWith(
        "Access restricted to Users only"
      );
    });

    it("Should revert when admin calls user-only function", async function () {
      const { rbac, owner } = await deployRBACFixture();
      await expect(rbac.userFunction()).to.be.revertedWith(
        "Access restricted to Users only"
      );
    });
  });
});
