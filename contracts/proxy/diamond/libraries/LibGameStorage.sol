// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LibGameStorage {
    bytes32 constant GAME_STORAGE_POSITION =
        keccak256("my.game.diamond.storage");

    struct GameStorage {
        // ---- ERC20-like data ----
        string tokenName;
        string tokenSymbol;
        uint8 tokenDecimals;
        uint256 totalSupply;
        mapping(address => uint256) balances;
        // ---- NFT-like data ----
        string nftName;
        string nftSymbol;
        uint256 nextTokenId; // auto-increment ID for new NFTs
        mapping(uint256 => address) nftOwner; // tokenId => owner
        mapping(address => uint256) nftBalance; // how many NFTs each address owns

        // ---- Staking data ----
        mapping(address => uint256) stakedAmounts;

        // ... More game data as needed (quests, marketplace, etc.)
    }

    function gameStorage() internal pure returns (GameStorage storage gs) {
        bytes32 position = GAME_STORAGE_POSITION;
        assembly {
            gs.slot := position
        }
    }
}
