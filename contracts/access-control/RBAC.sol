// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RBAC {
    // Define roles
    enum Role {
        None,
        Admin,
        User
    }

    // Mapping from address to role
    mapping(address => Role) public roles;

    // Modifier to restrict access to only admins
    modifier onlyAdmin() {
        require(
            roles[msg.sender] == Role.Admin,
            "Access restricted to Admins only"
        );
        _;
    }

    // Modifier to restrict access to only users
    modifier onlyUser() {
        require(
            roles[msg.sender] == Role.User,
            "Access restricted to Users only"
        );
        _;
    }

    // Constructor to set the deployer as the initial Admin
    constructor() {
        roles[msg.sender] = Role.Admin;
    }

    // Function to assign roles
    function assignRole(address _account, Role _role) public onlyAdmin {
        roles[_account] = _role;
    }

    // Admin-only function
    function adminFunction() public onlyAdmin {
        // Admin-specific logic
    }

    // User-only function
    function userFunction() public onlyUser {
        // User-specific logic
    }
}
