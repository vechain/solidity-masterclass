// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibDiamond} from "../libraries/LibDiamond.sol";
import {LibGameStorage} from "../libraries/LibGameStorage.sol";
import {IDiamondLoupe} from "../interfaces/IDiamondLoupe.sol";
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";
import {IERC173} from "../interfaces/IERC173.sol";
import {IERC165} from "../interfaces/IERC165.sol";

contract DiamondInit {
    // This function can take parameters if you want, or you can embed them in
    // your deployment script. We'll do a single aggregator approach here.
    function init(
        string calldata _tokenName,
        string calldata _tokenSymbol,
        uint8 _decimals,
        uint256 _initialSupply,
        string calldata _nftName,
        string calldata _nftSymbol
    ) external {
        // 1. Mark that we support certain interfaces (ERC165, EIP-2535, etc.)
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;

        // 2. Set up the ERC20 token
        //    We'll store these in LibGameStorage. You can add an enforceIsContractOwner()
        //    if you like, or rely on the diamondCut transaction's security.
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();
        gs.tokenName = _tokenName;
        gs.tokenSymbol = _tokenSymbol;
        gs.tokenDecimals = _decimals;

        // For supply, mint to diamond owner:
        address owner = ds.contractOwner;
        gs.balances[owner] = _initialSupply;
        gs.totalSupply = _initialSupply;

        // 3. Set up the NFT
        gs.nftName = _nftName;
        gs.nftSymbol = _nftSymbol;

        // 4. Optionally set other state variables
        // e.g. gs.nextTokenId = 0; // if you want to be explicit.

        // That's it! Now your diamond has everything configured in one function.
    }
}
