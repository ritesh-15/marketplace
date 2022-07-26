import { ethers } from "ethers";
import { MARKET_ABI, MARKET_ADDRESS, NFT_ABI, NFT_ADDRESS } from "../constants";

export const getNFTMarketContract = (eth) => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, signer);
  return contract;
};

export const getNFTContract = (eth) => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
  return contract;
};

export const getNFTContractUnSigned = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/GLG1-8dnFvbgXXcsusfqXJNsQPhiv9WY"
  );
  const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
  return contract;
};

export const getNFTMarketContractUnSigned = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/GLG1-8dnFvbgXXcsusfqXJNsQPhiv9WY"
  );
  const contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);
  return contract;
};
