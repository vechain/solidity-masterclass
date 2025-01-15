// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibGameStorage} from "../libraries/LibGameStorage.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";

/**
 * Example ERC20-like facet. No more init() here;
 * initialization occurs in DiamondInit.
 */
contract GameTokenFacet {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function name() external view returns (string memory) {
        return LibGameStorage.gameStorage().tokenName;
    }

    function symbol() external view returns (string memory) {
        return LibGameStorage.gameStorage().tokenSymbol;
    }

    function decimals() external view returns (uint8) {
        return LibGameStorage.gameStorage().tokenDecimals;
    }

    function totalSupply() external view returns (uint256) {
        return LibGameStorage.gameStorage().totalSupply;
    }

    function balanceOf(address _account) external view returns (uint256) {
        return LibGameStorage.gameStorage().balances[_account];
    }

    function transfer(address _to, uint256 _amount) external returns (bool) {
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();
        require(gs.balances[msg.sender] >= _amount, "Insufficient balance");
        gs.balances[msg.sender] -= _amount;
        gs.balances[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }
}
