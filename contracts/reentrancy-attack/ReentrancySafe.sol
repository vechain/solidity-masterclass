// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ReentrancySafe is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawAll() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // Check-Effects-Interactions pattern
        // Update state before interacting with other contracts
        balances[msg.sender] = 0; // Update state first

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
