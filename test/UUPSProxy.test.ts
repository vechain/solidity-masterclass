import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {
  ImplementationAuups,
  ImplementationAuups__factory,
  ImplementationBuups,
  ImplementationBuups__factory,
} from "../typechain-types";

describe("UUPS Proxy Pattern", function () {
  async function deployProxyFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();

    // Deploy implementation A
    const ImplementationA = await hre.ethers.getContractFactory(
      "ImplementationAuups"
    );
    const implementationA = await ImplementationA.deploy();

    // Deploy implementation B
    const ImplementationB = await hre.ethers.getContractFactory(
      "ImplementationBuups"
    );
    const implementationB = await ImplementationB.deploy();

    // Get the initialization data for implementation A
    const initData = implementationA.interface.encodeFunctionData("initialize");

    // Deploy ERC1967 proxy with implementation A
    const ERC1967Proxy = await hre.ethers.getContractFactory("ERC1967Proxy");
    const proxy = await ERC1967Proxy.deploy(
      await implementationA.getAddress(),
      initData
    );

    // Get implementation contract interface at proxy address
    const proxyAsImplA = ImplementationA.attach(
      await proxy.getAddress()
    ) as ImplementationAuups;

    const proxyAsImplB = ImplementationB.attach(
      await proxy.getAddress()
    ) as ImplementationBuups;

    return {
      proxy,
      implementationA,
      implementationB,
      proxyAsImplA,
      proxyAsImplB,
      owner,
      user1,
      user2,
    };
  }

  describe("Initial Deployment", function () {
    it("Should initialize with implementation A", async function () {
      const { proxyAsImplA, owner } = await loadFixture(deployProxyFixture);

      // Check owner is set correctly
      expect(await proxyAsImplA.owner()).to.equal(await owner.getAddress());

      // Check initial value
      expect(await proxyAsImplA.getValue()).to.equal(0);
    });

    it("Should allow setting value through proxy", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);

      // Set and verify value
      await proxyAsImplA.setValue(42);
      expect(await proxyAsImplA.getValue()).to.equal(42);
    });

    it("Should emit event when value changes", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);

      // Check event emission
      await expect(proxyAsImplA.setValue(42))
        .to.emit(proxyAsImplA, "ValueChanged")
        .withArgs(42);
    });
  });

  describe("Upgrade Process", function () {
    it("Should upgrade to implementation B", async function () {
      const { proxyAsImplA, proxyAsImplB, implementationB } = await loadFixture(
        deployProxyFixture
      );

      // Get initialization data for implementation B
      const initData = proxyAsImplB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Upgrade to implementation B
      await proxyAsImplA.upgradeToAndCall(
        await implementationB.getAddress(),
        initData
      );

      // Check new functionality
      await proxyAsImplB.setValue(200);
      expect(await proxyAsImplB.getValue()).to.equal(200);
      expect(await proxyAsImplB.extraValue()).to.equal(100);
      expect(await proxyAsImplB.sumValues()).to.equal(300);
    });

    it("Should maintain state after upgrade", async function () {
      const { proxyAsImplA, proxyAsImplB, implementationB } = await loadFixture(
        deployProxyFixture
      );

      // Set value in implementation A
      await proxyAsImplA.setValue(42);

      // Get initialization data for implementation B
      const initData = proxyAsImplB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Upgrade to implementation B
      await proxyAsImplA.upgradeToAndCall(
        await implementationB.getAddress(),
        initData
      );

      // Check value is preserved
      expect(await proxyAsImplB.getValue()).to.equal(42);
      expect(await proxyAsImplB.extraValue()).to.equal(100);
    });

    it("Should allow using new functionality after upgrade", async function () {
      const { proxyAsImplA, proxyAsImplB, implementationB } = await loadFixture(
        deployProxyFixture
      );

      // Get initialization data for implementation B
      const initData = proxyAsImplB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Upgrade to implementation B
      await proxyAsImplA.upgradeToAndCall(
        await implementationB.getAddress(),
        initData
      );

      // Use new functionality
      await proxyAsImplB.setExtraValue(200);
      expect(await proxyAsImplB.extraValue()).to.equal(200);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to upgrade", async function () {
      const { proxyAsImplA, implementationB, user1 } = await loadFixture(
        deployProxyFixture
      );

      // Get initialization data for implementation B
      const initData = implementationB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Non-owner upgrade attempt should fail
      await expect(
        proxyAsImplA
          .connect(user1)
          .upgradeToAndCall(await implementationB.getAddress(), initData)
      ).to.be.revertedWithCustomError(
        { interface: ImplementationAuups__factory.createInterface() },
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should allow owner to transfer ownership", async function () {
      const { proxyAsImplA, user1, user2 } = await loadFixture(
        deployProxyFixture
      );

      // Transfer ownership to user1
      await proxyAsImplA.transferOwnership(await user1.getAddress());
      expect(await proxyAsImplA.owner()).to.equal(await user1.getAddress());

      // User1 should be able to transfer ownership to user2
      await proxyAsImplA
        .connect(user1)
        .transferOwnership(await user2.getAddress());
      expect(await proxyAsImplA.owner()).to.equal(await user2.getAddress());
    });

    it("Should prevent implementation from being initialized directly", async function () {
      const { implementationA } = await loadFixture(deployProxyFixture);

      // Attempt to initialize implementation directly should fail
      await expect(implementationA.initialize()).to.be.revertedWithCustomError(
        { interface: ImplementationAuups__factory.createInterface() },
        "InvalidInitialization"
      );
    });
  });

  describe("Storage Layout", function () {
    it("Should handle complex data types correctly", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);

      // Set multiple values
      await proxyAsImplA.setValue(42);
      await proxyAsImplA.setValue(100);
      expect(await proxyAsImplA.getValue()).to.equal(100);
    });

    it("Should preserve all storage after upgrade", async function () {
      const { proxyAsImplA, proxyAsImplB, implementationB } = await loadFixture(
        deployProxyFixture
      );

      // Set values in A
      await proxyAsImplA.setValue(42);

      // Get initialization data for implementation B
      const initData = proxyAsImplB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Upgrade to B
      await proxyAsImplA.upgradeToAndCall(
        await implementationB.getAddress(),
        initData
      );

      // Check values in B
      expect(await proxyAsImplB.getValue()).to.equal(42);
      expect(await proxyAsImplB.extraValue()).to.equal(100);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero values correctly", async function () {
      const { proxyAsImplA } = await loadFixture(deployProxyFixture);
      await proxyAsImplA.setValue(0);
      expect(await proxyAsImplA.getValue()).to.equal(0);
    });

    it("Should handle multiple consecutive upgrades", async function () {
      const { proxyAsImplA, proxyAsImplB, implementationB } = await loadFixture(
        deployProxyFixture
      );

      // Get initialization data for implementation B
      const initData = proxyAsImplB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Multiple upgrades
      await proxyAsImplA.upgradeToAndCall(
        await implementationB.getAddress(),
        initData
      );
      await proxyAsImplB.upgradeToAndCall(
        await implementationB.getAddress(),
        "0x" // Empty initialization data so we don't reinitialize which would fail
      );

      // Should still work
      await proxyAsImplB.setValue(42);
      expect(await proxyAsImplB.extraValue()).to.equal(100);
    });

    it("Should prevent reinitialization after upgrade", async function () {
      const { proxyAsImplA, proxyAsImplB, implementationB } = await loadFixture(
        deployProxyFixture
      );

      // Get initialization data for implementation B
      const initData = proxyAsImplB.interface.encodeFunctionData(
        "initializeV2",
        [100]
      );

      // Upgrade to B
      await proxyAsImplA.upgradeToAndCall(
        await implementationB.getAddress(),
        initData
      );

      // Attempt to initialize again should fail
      await expect(proxyAsImplB.initialize()).to.be.revertedWithCustomError(
        { interface: ImplementationBuups__factory.createInterface() },
        "InvalidInitialization"
      );
    });

    it("Should prevent direct initialization of ImplementationA", async function () {
      const { implementationA } = await loadFixture(deployProxyFixture);

      // Attempt to initialize directly should fail
      await expect(implementationA.initialize()).to.be.revertedWithCustomError(
        { interface: ImplementationAuups__factory.createInterface() },
        "InvalidInitialization"
      );
    });
  });
});
