// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Metaverse NFT", "MNFT") {}

    // FUNCTIONS

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mint(address marketPlaceContractAddress, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        setApprovalForAll(marketPlaceContractAddress, true);

        return newTokenId;
    }
}
