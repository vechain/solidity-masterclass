// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReentrancyVulnerable {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawAll() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        // Dangerous: sending Ether before updating balance
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // Update the state after sending funds
        balances[msg.sender] = 0;
    }
}
