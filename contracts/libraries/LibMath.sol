// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MathLibExternal
 * @notice Library with external (or public) functions that require on-chain library linking.
 */
library LibMath {
    /**
     * @dev Doubles the input value.
     *      Declared as `external` so it requires library linking if used by other contracts.
     */
    function doubleValue(uint256 _val) external pure returns (uint256) {
        return _val * 2;
    }

    /**
     * @dev Halves the input value (integer division).
     *      Also declared as `external`.
     */
    function halfValue(uint256 _val) external pure returns (uint256) {
        return _val / 2;
    }
}
