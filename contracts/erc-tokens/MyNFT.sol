// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("RareItem", "RI") {}

    function mint() public {
        _safeMint(msg.sender, nextTokenId);
        nextTokenId++;
    }
}
