// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract OZAccessControl is AccessControl {
    // Define roles
    /*
        Bytes 32 is a fixed size byte array that always occupies 256 bits of storage. 
        Comparing two bytes32 variables is significantly cheaper than comparing two strings because the EVM operates on 256-bit words.
        This means that the EVM can compare two bytes32 variables without additional processing or memory overhead.
    */
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        // Grant the deployer the default admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Admin-only function
    function setSpecialValue(uint256 value) public onlyRole(ADMIN_ROLE) {
        // Logic for admins
    }

    // Minter-only function
    function mintToken(
        address to,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        // Minting logic
    }

    // Function to assign the minter role
    function addMinter(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }

    // Function to remove the minter role
    function removeMinter(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }
}
