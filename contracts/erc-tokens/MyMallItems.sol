// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyMallItems is ERC1155 {
    uint256 public constant SOCKS = 0;
    uint256 public constant SNEAKER = 1;

    constructor() ERC1155("https://mall.example/api/item/{id}.json") {
        _mint(msg.sender, SOCKS, 10, ""); // Mint 10 Socks
        _mint(msg.sender, SNEAKER, 1, ""); // Mint 1 Sneaker
    }
}
 