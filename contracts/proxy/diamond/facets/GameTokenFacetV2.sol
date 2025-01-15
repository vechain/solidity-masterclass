// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibGameStorage} from "../libraries/LibGameStorage.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";

contract GameTokenFacetV2 {
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event TransferFeeTaken(address indexed from, uint256 fee);

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

    /**
     * @dev Modified transfer logic: we burn 1 token from sender as a fee, if they have enough.
     */
    function transfer(address _to, uint256 _amount) external returns (bool) {
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();
        require(gs.balances[msg.sender] >= _amount, "Insufficient balance");

        // Burn 1 token as a fee, if _amount > 0 and user has at least 1 extra
        // For demonstration, if user doesn't have enough for the fee, revert
        require(gs.balances[msg.sender] >= _amount + 1, "Not enough for fee");
        gs.balances[msg.sender] -= _amount + 1;

        // Transfer to recipient
        gs.balances[_to] += _amount;

        // Burn 1 from total supply
        gs.totalSupply -= 1;

        emit TransferFeeTaken(msg.sender, 1);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }
}
