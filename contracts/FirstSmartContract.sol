// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IClassStudents } from "./IClassStudents.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FirstSmartContract
abstract contract FirstSmartContract is IClassStudents, Ownable {

   mapping(address => User) users;

   constructor() Ownable(msg.sender)  {}

    function getUser(address userAddress) public virtual view returns (User memory) {
        // there are some checks

        // -......
        return users[userAddress];
    }
    // 21M gas

    function addUser(string memory username, uint256 age, address userAddress) public onlyOwner { // 23000 gwei
        // Check that this user does not exist already
        require(getUser(userAddress).userAddress == address(0), "User already exists"); // 23000 gwei

        users[userAddress] = User(username, age, userAddress); // gas
        emit NewUserAdded(username, age, userAddress); // gas
    }
}
