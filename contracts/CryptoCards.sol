// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptoCards {
    mapping(address => string[]) private userCards;

    event CardMinted(address indexed user, string symbol);

    function mintCard(string memory symbol) public {
        require(bytes(symbol).length > 0, "Symbol is required");

        userCards[msg.sender].push(symbol);

        emit CardMinted(msg.sender, symbol);
    }

    function getMyCards() public view returns (string[] memory) {
        return userCards[msg.sender];
    }

    function getCardsByUser(address user) public view returns (string[] memory) {
        return userCards[user];
    }
}