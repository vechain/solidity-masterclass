// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibDiamond} from "../libraries/LibDiamond.sol";
import {LibGameStorage} from "../libraries/LibGameStorage.sol";

/**
 * @dev Example new feature facet for staking.
 */
contract StakingFacet {
    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);

    // Let's say we store how much each address has staked in GameStorage.
    // We'll add a new mapping: stakedAmounts
    // This means you must append it (or define it) in LibGameStorage if it didn't exist yet.

    function stake(uint256 _amount) external {
        // Let's assume we want to stake from the user's "GameTokenFacet" balance
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();

        // Check user balance
        require(
            gs.balances[msg.sender] >= _amount,
            "Insufficient token balance"
        );

        // Deduct from user's token balance
        gs.balances[msg.sender] -= _amount;

        // Increase stakedAmounts
        gs.stakedAmounts[msg.sender] += _amount;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external {
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();
        require(gs.stakedAmounts[msg.sender] >= _amount, "Not enough staked");

        gs.stakedAmounts[msg.sender] -= _amount;
        gs.balances[msg.sender] += _amount;

        emit Unstaked(msg.sender, _amount);
    }

    function stakedOf(address _account) external view returns (uint256) {
        return LibGameStorage.gameStorage().stakedAmounts[_account];
    }
}
