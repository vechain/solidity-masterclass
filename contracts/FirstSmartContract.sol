// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title FirstSmartContract
contract FirstSmartContract {
   address private contractOwner; // 0x00000000000

   struct User {
       string username;
       uint256 age;
       address userAddress;
   }

   mapping(address => User) users;

   event NewUserAdded(string username, uint256 indexed age, address userAddress);

   error UnauthorizedAccess(address caller);

   constructor() {
       contractOwner = msg.sender;
   }

    modifier onlyOwner() {
        if (msg.sender != contractOwner) {
            revert UnauthorizedAccess(msg.sender);
        }
        _;
    }


    function getUser(address userAddress) public view returns (User memory) {
        return users[userAddress];
    }

    // 21M gas

    function addUser(string memory username, uint256 age, address userAddress) public onlyOwner { // 23000 gwei
        users[userAddress] = User(username, age, userAddress); // gas
        emit NewUserAdded(username, age, userAddress); // gas
    }

    function getOwner() public view returns (address) {
        return contractOwner;
    }


    function getUserByUsername(string memory username) public view returns (User memory) {

    }

}
