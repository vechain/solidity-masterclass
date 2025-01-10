// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ExampleEIP712 is EIP712 {
    // Define the data structure that will be signed off-chain
    struct Message {
        address from;
        string content;
    }

    // Store a mapping of addresses to the last verified message they posted
    mapping(address => string) public messages;

    // The typehash is a constant that EIP-712 requires to ensure structured data integrity
    // It corresponds to the struct definition: "Message(address from,string content)"
    bytes32 private constant _MESSAGE_TYPEHASH =
        keccak256("Message(address from,string content)");

    // The EIP712 base constructor requires a name and version for your domain separator.
    // These values should not change during the lifecycle of the contract.
    constructor() EIP712("ExampleDapp", "1") {}

    /**
     * @dev Verifies a signed typed data structure and stores the message if valid.
     * @param from The address that claims to have signed the typed data.
     * @param content The message text that was signed.
     * @param signature The EIP-712 compliant signature.
     */
    function verifyAndStore(
        address from,
        string memory content,
        bytes memory signature
    ) public {
        // Compute the hash of the typed data by encoding the Message fields.
        // We use `keccak256` of the `content` string to securely encode it.
        bytes32 structHash = keccak256(
            abi.encode(_MESSAGE_TYPEHASH, from, keccak256(bytes(content)))
        );

        // Compute the final EIP712 hash to be signed: EIP712Domain + struct hash
        bytes32 digest = _hashTypedDataV4(structHash);

        // Recover the signer of the typed data
        address signer = ECDSA.recover(digest, signature);

        require(
            signer == from,
            "Invalid signature: signer does not match 'from' address"
        );

        // If valid, store the message
        messages[from] = content;
    }
}
