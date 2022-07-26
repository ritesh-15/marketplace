const NFT = artifacts.require("NFT");
const MarketPlace = artifacts.require("MarketPlace");

contract("Market Place Test", (accounts) => {
  it("Market Place", async () => {
    const nft = await NFT.deployed();
    const market = await MarketPlace.deployed();

    console.log(`Market Address ${market.address}`);
    console.log(`NFT Address ${nft.address}`);

    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    const accountThree = accounts[2];

    await nft.mint(market.address, "token 1");

    await nft.mint(market.address, "token 2");

    await nft.mint(market.address, "token 3", {
      from: accountTwo,
    });

    await nft.mint(market.address, "token 4", {
      from: accountThree,
    });

    const amount = web3.utils.toWei("1", "ether");

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    await market.createMarketItem(nft.address, 1, amount, {
      value: listingPrice,
    });

    await market.createMarketItem(nft.address, 2, amount, {
      value: listingPrice,
    });

    await market.createMarketItem(nft.address, 3, amount, {
      from: accountTwo,
      value: listingPrice,
    });

    await market.createMarketItem(nft.address, 4, amount, {
      from: accountThree,
      value: listingPrice,
    });

    let items = await market.fetchMarketItems();

    assert.equal(items.length, 4);

    assert.equal(items[0].tokenId, 1);
    assert.equal(items[0].itemId, 1);
    assert.equal(items[0].owner, market.address);
    assert.equal(items[0].amount, amount);
    assert.equal(items[0].seller, accountOne);

    console.log("Market Items", items);

    await market.createMarketItemSell(nft.address, 1, {
      from: accountTwo,
      value: amount,
    });

    await market.createMarketItemSell(nft.address, 2, {
      from: accountThree,
      value: amount,
    });

    await market.createMarketItemSell(nft.address, 3, {
      from: accountOne,
      value: amount,
    });

    items = await market.fetchMarketItems();

    console.log("Market Items", items);

    assert.equal(items.length, 1);

    let myNfts = await market.fetchMyNFTs({ from: accountOne });

    console.log("Account One NFTS", myNfts);
    assert.equal(myNfts.length, 1);

    myNfts = await market.fetchMyNFTs({ from: accountTwo });

    console.log("Account Two NFTS", myNfts);
    assert.equal(myNfts.length, 1);

    myNfts = await market.fetchMyNFTs({ from: accountThree });
    console.log("Account Three NFTS", myNfts);
    assert.equal(myNfts.length, 1);

    await market.createMarketItemSell(nft.address, 4, {
      from: accountThree,
      value: amount,
    });

    myNfts = await market.fetchMyNFTs({ from: accountThree });
    console.log("Account Three NFTS", myNfts);
    assert.equal(myNfts.length, 2);

    await nft.setApprovalForAll(market.address, true);

    await market.resellMarketItem(nft.address, 3, amount, {
      value: listingPrice,
    });

    items = await market.fetchMarketItems();
    console.log("Market Items", items);
    assert.equal(items.length, 1);

    myNfts = await market.fetchMyNFTs({ from: accountOne });
    console.log("Account One NFTS", myNfts);
    assert.equal(myNfts.length, 0);
  });
});
