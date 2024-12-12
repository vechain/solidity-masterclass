// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IClassStudents } from "./IClassStudents.sol";
import { IERC20 } from "./IERC20.sol";

/// @title RedeemPrize
contract RedeemPrize {

    IClassStudents private firstSmartContract;
    IERC20 private rewardToken;

    constructor(address _firstSmartContractAddress, address _rewardTokenAddress) {
        firstSmartContract = IClassStudents(_firstSmartContractAddress);
        rewardToken = IERC20(_rewardTokenAddress);
    }


    function claim() public {
        // check if the user was added to FirstSmartContract
        address claimer = msg.sender;
        IClassStudents.User memory claimerFromContract = firstSmartContract.getUser(claimer);

        if (claimerFromContract.userAddress == address(0)) {
            revert("User not found");
        }

        // check if contract has enough balance, otherwise revert
        require(rewardToken.balanceOf(address(this)) >= 1 ether, "Not enough balance");

        // send the token
        rewardToken.transfer(claimer, 1 ether);
    }
}