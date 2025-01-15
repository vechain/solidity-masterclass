// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ImplementationAuups.sol";

/**
 * @title ImplementationB (V2)
 * @dev Second version of our UUPS contract. Inherits from ImplementationAuups to keep the same storage structure.
 */
contract ImplementationBuups is ImplementationAuups {
    /// @notice New state variable added in V2 (must be after `value` to avoid storage collision).
    uint256 public extraValue;

    /// @notice Event emitted when `extraValue` is updated.
    event ExtraValueChanged(uint256 newExtraValue);

    /**
     * @notice Constructor that disables initializers on the implementation contract.
     * @dev The `_disableInitializers()` function prevents the implementation contract from being initialized directly.
     *      This is critical because, in an upgradeable proxy pattern, the proxy should hold the state, not the implementation.
     *
     *      The `_disableInitializers()` function sets the internal state variable `_initialized` to the maximum value (`type(uint8).max`),
     *      ensuring that any call to an `initializer`-protected function will revert.
     *
     *      This mitigates the risk of someone directly initializing the implementation contract,
     *      which could lead to a security vulnerability where ownership and storage could be compromised.
     *
     * @custom:oz-upgrades-unsafe-allow constructor
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Upgrades the contract with new features and sets `extraValue` once.
     * @dev `reinitializer(2)` ensures this function can only be called once, and only if the contract
     *      was previously initialized with a lower version (like 1).
     */
    function initializeV2(uint256 _extraValue) external reinitializer(2) {
        // We can re-run any logic needed for V2. For instance, setting a new variable:
        extraValue = _extraValue;
        emit ExtraValueChanged(_extraValue);
    }

    /**
     * @notice Sets `extraValue`.
     */
    function setExtraValue(uint256 _extraValue) external onlyOwner {
        extraValue = _extraValue;
        emit ExtraValueChanged(_extraValue);
    }

    /**
     * @notice Example function to show the new behavior or logic in V2.
     * @return sum The sum of `value` and `extraValue` (just for demo).
     */
    function sumValues() external view returns (uint256 sum) {
        return value + extraValue;
    }

    /**
     * @notice Same `_authorizeUpgrade` as before, restricting upgrades to the owner.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override onlyOwner {}
}
