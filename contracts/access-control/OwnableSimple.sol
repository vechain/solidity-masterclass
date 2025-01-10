// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OwnableSimple {
    address public owner;

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Access restricted to the owner");
        _;
    }

    // Constructor to set the deployer as the initial owner
    constructor() {
        owner = msg.sender;
    }

    // Function to transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    // Owner-only function
    function ownerFunction() public onlyOwner {
        // Owner-specific logic
    }
}
