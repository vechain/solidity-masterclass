// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImplementationA {
    uint256 private _value;
    uint256[] private _values;

    function version() public pure returns (string memory) {
        return "A";
    }

    function setValue(uint256 newValue) public {
        _value = newValue;
    }

    function getValue() public view returns (uint256) {
        return _value;
    }

    function addToArray(uint256 newValue) public {
        _values.push(newValue);
    }

    function getArrayLength() public view returns (uint256) {
        return _values.length;
    }

    function getArrayValue(uint256 index) public view returns (uint256) {
        return _values[index];
    }
}
