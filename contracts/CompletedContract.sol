// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { FirstSmartContract } from "./FirstSmartContract.sol";
import { SecondClassStudents } from "./SecondClassStudents.sol";
import { IClassStudents } from "./IClassStudents.sol";


contract CompletedContract is FirstSmartContract {

    function getUser(address userAddress) override virtual public view returns (User memory) {
        // do some checks

        // -......
        
        return super.getUser(userAddress);
    }

}