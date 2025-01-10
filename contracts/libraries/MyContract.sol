// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./LibStrings.sol";
import "./LibMath.sol";

contract MyContract {
    using LibStrings for string;
    using LibMath for uint256;

    function isCoolItem(string memory itemName) external pure returns (bool) {
        // Compare
        return itemName.compare("CoolItem");
    }

    function itemHasPrefix(
        string memory itemName
    ) external pure returns (bool) {
        return itemName.startsWith("Sword");
    }

    function doubleValue(uint256 _val) external pure returns (uint256) {
        return _val.doubleValue();
    }

    function halfValue(uint256 _val) external pure returns (uint256) {
        return _val.halfValue();
    }
}
