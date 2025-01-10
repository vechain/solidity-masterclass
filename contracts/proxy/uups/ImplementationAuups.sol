// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title ImplementationAuups
 * @dev Example of a UUPS (Universal Upgradeable Proxy Standard) upgradeable smart contract.
 * This contract uses OpenZeppelin's `Initializable`, `OwnableUpgradeable`, and `UUPSUpgradeable`.
 * It includes upgradeable storage and logic with proper access control using the UUPS pattern.
 */
contract ImplementationAuups is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @notice Public variable to store the value.
    uint256 public value;

    /// @notice Event emitted when the `value` is updated.
    /// @param newValue The new value being set in the contract.
    event ValueChanged(uint256 newValue);

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
     * @notice Initializes the proxy contract and sets the owner.
     * @dev Can only be called once due to the `initializer` modifier.
     * It initializes the ownership of the contract and ensures it's set only through the proxy.
     */
    function initialize() external initializer {
        __Ownable_init(msg.sender);
    }

    /**
     * @notice Sets the value stored in the contract.
     * @dev Can only be called by an external account interacting with the proxy.
     * @param _value The new value to be stored.
     */
    function setValue(uint256 _value) external {
        value = _value;
        emit ValueChanged(_value);
    }

    /**
     * @notice Retrieves the current value stored in the contract.
     * @return The current value stored in the contract.
     */
    function getValue() external view returns (uint256) {
        return value;
    }

    /**
     * @notice Authorizes the upgrade to a new implementation contract.
     * @dev This function is part of the UUPS upgrade mechanism and restricts upgradeability to the contract owner.
     * @param newImplementation The address of the new implementation contract.
     * @dev Only the owner can call this function.
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override onlyOwner {}
}
