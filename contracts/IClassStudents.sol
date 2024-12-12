// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IClassStudents {
    struct User {
       string username;
       uint256 age;
       address userAddress;
   }

    event NewUserAdded(string username, uint256 indexed age, address userAddress);

    error UnauthorizedAccess(address caller);

    function addUser(string memory username, uint256 age, address userAddress) external;

    function getUser(address userAddress) external returns (User memory);
}