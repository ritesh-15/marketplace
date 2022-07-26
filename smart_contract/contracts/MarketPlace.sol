// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsCount;
    Counters.Counter private _soldItemsCount;

    // VARIABLES

    address payable owner;
    uint256 private _listingPrice = 0.0025 ether;

    mapping(uint256 => MarketItem) private _idToMarketItems;

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        address nft;
        uint256 amount;
        address payable seller;
        address payable owner;
        uint256 timestamp;
        bool sold;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    // EVENTS

    event Offered(
        uint256 indexed itemId,
        uint256 tokenId,
        address nft,
        uint256 amount,
        address payable seller,
        address payable owner,
        uint256 timestamp,
        bool sold
    );

    event Brought(
        uint256 indexed itemId,
        uint256 tokenId,
        address nft,
        uint256 amount,
        address payable seller,
        address payable owner,
        uint256 timestamp,
        bool sold
    );

    event ReSell(
        uint256 indexed itemId,
        uint256 tokenId,
        address nft,
        uint256 amount,
        address payable seller,
        address payable owner,
        uint256 timestamp,
        bool sold
    );

    //  MODIFIERS

    modifier isOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier isListingPrice() {
        require(msg.value == _listingPrice, "The listing price is not correct");
        _;
    }

    modifier isNFTOwner(uint256 itemId) {
        require(
            msg.sender == _idToMarketItems[itemId].owner,
            "You are not owner of this NFT!"
        );
        _;
    }

    modifier isCorrectAmount(uint256 itemId) {
        uint256 amount = _idToMarketItems[itemId].amount;
        require(msg.value == amount, "The amount is not correct");
        _;
    }

    // FUNCTIONS

    function getListingPrice() public view returns (uint256) {
        return _listingPrice;
    }

    function updateListingPrice(uint256 _newListingPrice)
        public
        payable
        isOwner
    {
        _listingPrice = _newListingPrice;
    }

    function createMarketItem(
        address _nftAddress,
        uint256 tokenId,
        uint256 amount
    ) public payable isListingPrice {
        _itemsCount.increment();

        uint256 newItemId = _itemsCount.current();

        _idToMarketItems[newItemId] = MarketItem(
            newItemId,
            tokenId,
            _nftAddress,
            amount,
            payable(msg.sender),
            payable(address(this)),
            block.timestamp,
            false
        );

        IERC721(_nftAddress).transferFrom(msg.sender, address(this), tokenId);

        emit Offered(
            newItemId,
            tokenId,
            _nftAddress,
            amount,
            payable(msg.sender),
            payable(address(0)),
            block.timestamp,
            false
        );
    }

    function resellMarketItem(
        address nftAddress,
        uint256 itemId,
        uint256 amount
    ) public payable isListingPrice isNFTOwner(itemId) {
        uint256 tokenId = _idToMarketItems[itemId].tokenId;

        require(
            IERC721(nftAddress).ownerOf(tokenId) == msg.sender,
            "You are not owner of this NFT!"
        );

        _soldItemsCount.decrement();

        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        _idToMarketItems[itemId].sold = false;
        _idToMarketItems[itemId].owner = payable(address(this));
        _idToMarketItems[itemId].seller = payable(msg.sender);
        _idToMarketItems[itemId].amount = amount;

        emit ReSell(
            itemId,
            tokenId,
            nftAddress,
            amount,
            payable(msg.sender),
            payable(address(this)),
            block.timestamp,
            false
        );
    }

    function createMarketItemSell(address nftAddress, uint256 itemId)
        public
        payable
    {
        address seller = _idToMarketItems[itemId].seller;
        uint256 amount = _idToMarketItems[itemId].amount;
        uint256 tokenId = _idToMarketItems[itemId].tokenId;

        require(amount == msg.value, "The amount is not correct");

        _idToMarketItems[itemId].sold = true;
        _idToMarketItems[itemId].timestamp = block.timestamp;
        _idToMarketItems[itemId].owner = payable(msg.sender);

        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);

        _soldItemsCount.increment();

        emit Brought(
            itemId,
            tokenId,
            nftAddress,
            _idToMarketItems[itemId].amount,
            payable(address(this)),
            payable(msg.sender),
            block.timestamp,
            true
        );

        payable(owner).transfer(_listingPrice);

        payable(seller).transfer(msg.value);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 totalCount = _itemsCount.current();

        uint256 unSoldCount = _itemsCount.current() - _soldItemsCount.current();

        uint256 index = 0;

        MarketItem[] memory items = new MarketItem[](unSoldCount);

        for (uint256 i = 0; i < totalCount; i++) {
            if (
                _idToMarketItems[i + 1].owner == address(this) &&
                _idToMarketItems[i + 1].sold == false
            ) {
                uint256 currentItemIndex = i + 1;

                MarketItem storage item = _idToMarketItems[currentItemIndex];

                items[index] = item;

                index = index + 1;
            }
        }

        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalCount = _itemsCount.current();

        uint256 count = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (_idToMarketItems[i + 1].owner == payable(msg.sender)) {
                count = count + 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);

        uint256 index = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (_idToMarketItems[i + 1].owner == payable(msg.sender)) {
                uint256 currentItemIndex = i + 1;

                items[index] = _idToMarketItems[currentItemIndex];

                index = index + 1;
            }
        }

        return items;
    }

    function fethNFTsCreatedByMe() public view returns (MarketItem[] memory) {
        uint256 totalCount = _itemsCount.current();
        uint256 index = 0;

        uint256 myNFTsCount = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (_idToMarketItems[i + 1].seller == msg.sender) {
                myNFTsCount = myNFTsCount + 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](myNFTsCount);

        for (uint256 i = 0; i < myNFTsCount; i++) {
            if (_idToMarketItems[i + 1].seller == msg.sender) {
                uint256 currentItemIndex = i + 1;

                MarketItem storage item = _idToMarketItems[currentItemIndex];

                items[index] = item;

                index = index + 1;
            }
        }

        return items;
    }
}
