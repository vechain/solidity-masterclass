import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ExampleEIP712", function () {
  async function deployExampleEIP712Fixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    const ExampleEIP712 = await hre.ethers.getContractFactory("ExampleEIP712");
    const eip712 = await ExampleEIP712.deploy();

    return { eip712, owner, user1, user2 };
  }

  // Helper function to create the domain separator
  async function getDomain(contractAddress: string) {
    return {
      name: "ExampleDapp",
      version: "1",
      chainId: (await hre.ethers.provider.getNetwork()).chainId,
      verifyingContract: contractAddress,
    };
  }

  // Helper function to create the types structure for EIP-712
  const types = {
    Message: [
      { name: "from", type: "address" },
      { name: "content", type: "string" },
    ],
  };

  describe("Message Verification and Storage", function () {
    it("Should verify and store a valid signed message", async function () {
      const { eip712, user1 } = await loadFixture(deployExampleEIP712Fixture);

      const message = {
        from: user1.address,
        content: "Hello, EIP-712!",
      };

      const domain = await getDomain(await eip712.getAddress());

      // Sign the message using EIP-712
      const signature = await user1.signTypedData(domain, types, message);

      // Verify and store the message
      await eip712.verifyAndStore(message.from, message.content, signature);

      // Check if the message was stored correctly
      expect(await eip712.messages(user1.address)).to.equal(message.content);
    });

    it("Should reject message with invalid signature", async function () {
      const { eip712, user1, user2 } = await loadFixture(
        deployExampleEIP712Fixture
      );

      const message = {
        from: user1.address,
        content: "Hello, EIP-712!",
      };

      const domain = await getDomain(await eip712.getAddress());

      // Sign the message with a different user
      const signature = await user2.signTypedData(domain, types, message);

      // Attempt to verify and store should fail
      await expect(
        eip712.verifyAndStore(message.from, message.content, signature)
      ).to.be.revertedWith(
        "Invalid signature: signer does not match 'from' address"
      );
    });

    it("Should allow updating message with new signature", async function () {
      const { eip712, user1 } = await loadFixture(deployExampleEIP712Fixture);

      const message1 = {
        from: user1.address,
        content: "First message",
      };

      const message2 = {
        from: user1.address,
        content: "Updated message",
      };

      const domain = await getDomain(await eip712.getAddress());

      // Sign and store first message
      const signature1 = await user1.signTypedData(domain, types, message1);
      await eip712.verifyAndStore(message1.from, message1.content, signature1);

      // Sign and store second message
      const signature2 = await user1.signTypedData(domain, types, message2);
      await eip712.verifyAndStore(message2.from, message2.content, signature2);

      // Check if the updated message was stored
      expect(await eip712.messages(user1.address)).to.equal(message2.content);
    });

    it("Should handle empty message content", async function () {
      const { eip712, user1 } = await loadFixture(deployExampleEIP712Fixture);

      const message = {
        from: user1.address,
        content: "",
      };

      const domain = await getDomain(await eip712.getAddress());
      const signature = await user1.signTypedData(domain, types, message);

      await eip712.verifyAndStore(message.from, message.content, signature);
      expect(await eip712.messages(user1.address)).to.equal("");
    });

    it("Should handle long message content", async function () {
      const { eip712, user1 } = await loadFixture(deployExampleEIP712Fixture);

      const longContent = "a".repeat(1000); // Create a 1000 character string
      const message = {
        from: user1.address,
        content: longContent,
      };

      const domain = await getDomain(await eip712.getAddress());
      const signature = await user1.signTypedData(domain, types, message);

      await eip712.verifyAndStore(message.from, message.content, signature);
      expect(await eip712.messages(user1.address)).to.equal(longContent);
    });

    it("Should reject if signer address doesn't match 'from' field", async function () {
      const { eip712, user1, user2 } = await loadFixture(
        deployExampleEIP712Fixture
      );

      const message = {
        from: user2.address, // Using user2's address in the message
        content: "Hello, EIP-712!",
      };

      const domain = await getDomain(await eip712.getAddress());
      const signature = await user1.signTypedData(domain, types, message); // But signing with user1

      await expect(
        eip712.verifyAndStore(message.from, message.content, signature)
      ).to.be.revertedWith(
        "Invalid signature: signer does not match 'from' address"
      );
    });

    it("Should verify domain separator components", async function () {
      const { eip712 } = await loadFixture(deployExampleEIP712Fixture);

      // Get the domain separator from the contract
      const domainSeparator = await eip712.eip712Domain();

      // Verify domain components
      expect(domainSeparator.name).to.equal("ExampleDapp");
      expect(domainSeparator.version).to.equal("1");
      expect(domainSeparator.chainId).to.equal(
        (await hre.ethers.provider.getNetwork()).chainId
      );
      expect(domainSeparator.verifyingContract).to.equal(
        await eip712.getAddress()
      );
    });
  });
});
