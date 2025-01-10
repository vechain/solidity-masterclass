// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibGameStorage} from "../libraries/LibGameStorage.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";

/**
 * Example NFT-like facet. No more init() here;
 * initialization occurs in DiamondInit.
 */
contract GameNFTFacet {
    event TransferNFT(
        address indexed from,
        address indexed to,
        uint256 tokenId
    );

    function nftName() external view returns (string memory) {
        return LibGameStorage.gameStorage().nftName;
    }

    function nftSymbol() external view returns (string memory) {
        return LibGameStorage.gameStorage().nftSymbol;
    }

    function mintNFT(address _to) external {
        LibDiamond.enforceIsContractOwner();
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();

        uint256 newId = gs.nextTokenId;
        gs.nftOwner[newId] = _to;
        gs.nftBalance[_to] += 1;
        gs.nextTokenId += 1;

        emit TransferNFT(address(0), _to, newId);
    }

    function transferNFT(address _to, uint256 _tokenId) external {
        LibGameStorage.GameStorage storage gs = LibGameStorage.gameStorage();
        require(gs.nftOwner[_tokenId] == msg.sender, "Not token owner");

        gs.nftOwner[_tokenId] = _to;
        gs.nftBalance[msg.sender] -= 1;
        gs.nftBalance[_to] += 1;

        emit TransferNFT(msg.sender, _to, _tokenId);
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return LibGameStorage.gameStorage().nftOwner[_tokenId];
    }

    function balanceOfNFT(address _addr) external view returns (uint256) {
        return LibGameStorage.gameStorage().nftBalance[_addr];
    }
}
