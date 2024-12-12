// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IClassStudents } from "./IClassStudents.sol";

/// @title FirstSmartContract
abstract contract SecondClassStudents is IClassStudents {
       mapping(address => User) users2;

    function getUser(address userAddress) public virtual view returns (User memory) {
        // there are some checks

        // -......
        return users2[userAddress];
    }
}
