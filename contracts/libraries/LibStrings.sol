// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibStrings {
    /**
     * @notice Compares two strings
     * @param a - first string
     * @param b - second string
     * @return true if the strings are equal, false otherwise
     */
    function compare(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    /**
     * @notice Checks if a string starts with a prefix
     * @param str - string to check
     * @param prefix - prefix to check for
     * @return true if the string starts with the prefix, false otherwise
     */
    function startsWith(
        string memory str,
        string memory prefix
    ) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory prefixBytes = bytes(prefix);
        if (prefixBytes.length > strBytes.length) return false;
        for (uint256 i = 0; i < prefixBytes.length; i++) {
            if (strBytes[i] != prefixBytes[i]) return false;
        }
        return true;
    }
}
