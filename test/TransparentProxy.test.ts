import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { ImplementationA, ImplementationB } from "../typechain-types";

describe("TransparentProxy", function () {
  async function deployProxyFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();

    // Deploy implementation A
    const ImplementationA = await hre.ethers.getContractFactory(
      "ImplementationA"
    );
    const implementationA = await ImplementationA.deploy();

    // Deploy implementation B (upgraded version)
    const ImplementationB = await hre.ethers.getContractFactory(
      "ImplementationB"
    );
    const implementationB = await ImplementationB.deploy();

    // Deploy transparent proxy with implementation A
    const TransparentUpgradeableProxy = await hre.ethers.getContractFactory(
      "TransparentUpgradeableProxy"
    );
    const proxy = await TransparentUpgradeableProxy.deploy(
      await implementationA.getAddress(),
      owner.address,
      "0x" // Empty initialization data
    );

    // Get the proxy admin contract that is created upon deployment of the TransparentUpgradeableProxy
    const proxyAdmin = await ethers.getContractAt(
      "ProxyAdmin",
      ethers.getCreateAddress({ from: await proxy.getAddress(), nonce: 1n })
    );

    // Get implementation contract interface at proxy address
    const proxyAsImplA = ImplementationA.attach(
      await proxy.getAddress()
    ) as ImplementationA;

    const proxyAsImplB = ImplementationB.attach(
      await proxy.getAddress()
    ) as ImplementationB;

    return {
      proxy,
      implementationA,
      implementationB,
      proxyAdmin,
      proxyAsImplA,
      proxyAsImplB,
      owner,
      user1,
      user2,
    };
  }

  describe("Initial Deployment", function () {
    it("Should initialize with implementation A", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);
      expect(await proxyAsImplA.version()).to.equal("A");
    });

    it("Should allow setting value through proxy", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);
      await proxyAsImplA.setValue(42);
      expect(await proxyAsImplA.getValue()).to.equal(42);
    });

    it("Should maintain state between calls", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);
      await proxyAsImplA.setValue(42);
      await proxyAsImplA.setValue(100);
      expect(await proxyAsImplA.getValue()).to.equal(100);
    });
  });

  describe("Upgrade Process", function () {
    it("Should upgrade to implementation B", async function () {
      const { proxy, implementationB, proxyAdmin, proxyAsImplB } =
        await loadFixture(deployProxyFixture);

      // Upgrade to implementation B
      await proxyAdmin.upgradeAndCall(
        await proxy.getAddress(),
        await implementationB.getAddress(),
        "0x" // Empty initialization data
      );

      // Check new version
      expect(await proxyAsImplB.version()).to.equal("B");
    });

    it("Should maintain state after upgrade", async function () {
      const { proxy, implementationB, proxyAdmin, proxyAsImplA, proxyAsImplB } =
        await loadFixture(deployProxyFixture);

      // Set value in implementation A
      await proxyAsImplA.setValue(42);

      // Upgrade to implementation B
      await proxyAdmin.upgradeAndCall(
        await proxy.getAddress(),
        await implementationB.getAddress(),
        "0x" // Empty initialization data
      );

      // Value should be preserved
      expect(await proxyAsImplB.getValue()).to.equal(42);
    });

    it("Should allow using new functionality after upgrade", async function () {
      const { proxy, implementationB, proxyAdmin, proxyAsImplB } =
        await loadFixture(deployProxyFixture);

      // Upgrade to implementation B
      await proxyAdmin.upgradeAndCall(
        await proxy.getAddress(),
        await implementationB.getAddress(),
        "0x" // Empty initialization data
      );

      // Use new functionality from B
      await proxyAsImplB.setValue(42);
      expect(await proxyAsImplB.getDoubleValue()).to.equal(84);
    });
  });

  describe("Access Control", function () {
    it("Should only allow admin to upgrade", async function () {
      const { proxy, proxyAdmin, implementationB, user1 } = await loadFixture(
        deployProxyFixture
      );

      // Attempt to upgrade should fail
      await expect(
        proxyAdmin.connect(user1).upgradeAndCall(
          await proxy.getAddress(),
          await implementationB.getAddress(),
          "0x" // Empty initialization data"
        )
      ).to.be.reverted;
    });
  });

  describe("Storage Layout", function () {
    it("Should handle complex data types correctly", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);

      // Test array storage
      await proxyAsImplA.addToArray(42);
      await proxyAsImplA.addToArray(100);
      expect(await proxyAsImplA.getArrayLength()).to.equal(2);
      expect(await proxyAsImplA.getArrayValue(0)).to.equal(42);
    });

    it("Should preserve complex data after upgrade", async function () {
      const { proxy, implementationB, proxyAdmin, proxyAsImplA, proxyAsImplB } =
        await loadFixture(deployProxyFixture);

      // Set complex data in A
      await proxyAsImplA.addToArray(42);
      await proxyAsImplA.addToArray(100);

      // Upgrade to B
      await proxyAdmin.upgradeAndCall(
        await proxy.getAddress(),
        await implementationB.getAddress(),
        "0x" // Empty initialization data
      );

      // Verify data is preserved
      expect(await proxyAsImplB.getArrayLength()).to.equal(2);
      expect(await proxyAsImplB.getArrayValue(0)).to.equal(42);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero values correctly", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);
      await proxyAsImplA.setValue(0);
      expect(await proxyAsImplA.getValue()).to.equal(0);
    });

    it("Should handle multiple consecutive upgrades", async function () {
      const { proxy, implementationB, proxyAdmin, proxyAsImplB } =
        await loadFixture(deployProxyFixture);

      // Upgrade multiple times
      await proxyAdmin.upgradeAndCall(
        await proxy.getAddress(),
        await implementationB.getAddress(),
        "0x" // Empty initialization data
      );
      await proxyAdmin.upgradeAndCall(
        await proxy.getAddress(),
        await implementationB.getAddress(),
        "0x" // Empty initialization data
      );

      // Should still work
      expect(await proxyAsImplB.version()).to.equal("B");
    });
  });
});
