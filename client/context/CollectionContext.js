import { createContext, useContext, useEffect, useState } from "react";
import {
  getNFTMarketContract,
  getNFTMarketContractUnSigned,
  getNFTContract,
  getNFTContractUnSigned,
} from "../lib/getContracts";
import { pinFileToIPFS, pinJSONToIPFS } from "../lib/pinata";
import { useUser } from "./UserContext";
import { ethers } from "ethers";
import axios from "axios";
import { _toEscapedUtf8String } from "ethers/lib/utils";
import { toast } from "react-toastify";

let eth = null;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const CollectionContext = createContext();

export const CollectionContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);

  const { connectedAccount, connectWallet } = useUser();

  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [nftImage, setNftImage] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const file = files[0];
    setNftImage(file);
  };

  const handleMint = async (e) => {
    e.preventDefault();

    const { name, description, price } = formData;

    if (!eth)
      return setError("Ethereum wallet not found please reload the window!");

    if (!name) return setError("Name is required");

    if (!price) return setError("Price is required");

    if (!description) return setError("Description is required");

    if (!nftImage) return setError("Image is required");

    setError("");

    try {
      setMinting(true);

      const fileHash = await pinFileToIPFS(nftImage, { name, description });

      const jsonHash = await pinJSONToIPFS({
        name,
        description,
        image: fileHash,
      });

      const nftMarketContract = getNFTMarketContract(eth);
      const nftContract = getNFTContract(eth);

      const nftTransaction = await nftContract.mint(
        nftMarketContract.address,
        jsonHash
      );

      await nftTransaction.wait();

      const tokenId = await nftContract.getCurrentTokenId();

      const listingPrice = await nftMarketContract.getListingPrice();

      const metadata = await nftMarketContract.createMarketItem(
        nftContract.address,
        tokenId,
        ethers.utils.parseEther(formData.price)._hex,
        {
          value: listingPrice.toString(),
        }
      );

      setMinting(false);

      getListedNFTs();

      setMinted(true);

      // TODO close the modal
    } catch (error) {
      setMinting(false);
      toast.error("Something went wrong while minting your NFT!");
    }
  };

  const buyNFT = async (itemId, price) => {
    if (!eth) {
      toast.error("No ethereum wallet found please refresh the window!");
      return;
    }

    if (!connectedAccount) {
      return connectWallet();
    }

    try {
      const market = getNFTMarketContract(window.ethereum);
      const nftContract = getNFTContract(eth);

      setIsBuying(true);

      const transaction = await market.createMarketItemSell(
        nftContract.address,
        itemId,
        {
          value: ethers.utils.parseEther(price)._hex,
        }
      );

      setIsBuying(false);
      getMyNFTCollection();
    } catch (error) {
      setIsBuying(false);
      toast.error("Something went wrong please try again!");
    }
  };

  const resellNFT = async (itemId, price) => {
    if (!eth) {
      toast.error("No ethereum wallet found please refresh the window!");
      return;
    }

    if (!price) {
      toast.error("Price is not provided please provide the price!");
      return;
    }

    const market = getNFTMarketContract(eth);
    const nftContract = getNFTContract(eth);

    try {
      await nftContract.setApprovalForAll(market.address, true);
      const listingPrice = await market.getListingPrice();

      const txHash = await market.resellMarketItem(
        nftContract.address,
        itemId,
        ethers.utils.parseEther(price)._hex,
        {
          from: connectedAccount,
          value: listingPrice.toString(),
        }
      );
    } catch (error) {
      toast.error("Something went wrong please try again!");
    }
  };

  const getListedNFTs = async () => {
    setLoadingNFTs(true);
    try {
      const market = getNFTMarketContractUnSigned();
      const nftContract = getNFTContractUnSigned();

      const data = await market.fetchMarketItems();

      const items = await Promise.all(
        data.map(async (item) => {
          const tokenURI = await nftContract.tokenURI(
            parseInt(item.tokenId.toString())
          );

          const price = ethers.utils.formatUnits(item.amount, "ether");

          const { data } = await axios.get(
            `https://gateway.pinata.cloud/ipfs/${tokenURI}`
          );

          const itemDto = {
            price,
            tokenId: item.tokenId.toNumber(),
            seller: item.seller.toString(),
            owner: item.owner,
            image: data.image,
            name: data.name,
            description: data.description,
            sold: item.sold,
            timestamp: item.timestamp.toString(),
            itemId: item.itemId.toNumber(),
          };

          return itemDto;
        })
      );
      setLoadingNFTs(false);
      setNfts(items);
    } catch (error) {
      setLoadingNFTs(false);
      toast.error("Something went wrong while fetching the nfts!");
    }
  };

  const getMyNFTCollection = async () => {
    if (!eth) {
      toast.error("No ethereum wallet found please refresh the window!");
      return;
    }

    const market = getNFTMarketContract(eth);
    const nftContract = getNFTContract(eth);

    setLoadingNFTs(true);
    try {
      const data = await market.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async (item) => {
          const tokenURI = await nftContract.tokenURI(
            parseInt(item.tokenId.toString())
          );

          const price = ethers.utils.formatUnits(item.amount, "ether");

          const { data } = await axios.get(
            `https://gateway.pinata.cloud/ipfs/${tokenURI}`
          );

          const itemDto = {
            price,
            tokenId: item.tokenId.toNumber(),
            seller: item.seller,
            owner: item.owner,
            image: data.image,
            name: data.name,
            description: data.description,
            sold: item.sold,
            timestamp: item.timestamp.toString(),
            itemId: item.itemId.toNumber(),
          };

          return itemDto;
        })
      );

      setMyNFTs(items);
      setLoadingNFTs(false);
    } catch (error) {
      setLoadingNFTs(false);
      toast.error("Something went wrong while fetching the nfts!");
    }
  };

  useEffect(() => {
    getListedNFTs();
  }, []);

  useEffect(() => {
    if (!connectedAccount) return;
    getMyNFTCollection();
  }, [connectedAccount]);

  return (
    <CollectionContext.Provider
      value={{
        nfts,
        loading,
        handleChange,
        formData,
        nftImage,
        handleImageChange,
        setNftImage,
        handleMint,
        minting,
        error,
        buyNFT,
        isBuying,
        myNFTs,
        resellNFT,
        loadingNFTs,
        minted,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
