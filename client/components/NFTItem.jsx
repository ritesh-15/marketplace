import React, { useState } from "react";
import { useCollection } from "../context/CollectionContext";
import { useUser } from "../context/UserContext";
import { shortenAccountAddress } from "../utils/shortenAccountAddress";
import ResellNFT from "./ResellNFT";

const style = {
  wrapper:
    "flex w-[350px] border border-gray-700 mx-auto flex-col rounded-lg overflow-hidden",
  imageContainer: "w-full h-[300px] overflow-hidden",
  image: "object-cover w-full h-full",
  content: "bg-primary p-4",
  h1: "text-2xl text-white font-bold font-nunito",
  p: "font-nunito text-white",
  button:
    "bg-secondary w-full py-3 text-white font-bold capitalize font-nunito",
};

const NFTItem = ({
  image,
  tokenId,
  name,
  description,
  price,
  owner,
  seller,
  sold,
  itemId,
}) => {
  const { buyNFT } = useCollection();
  const { connectedAccount } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ResellNFT setOpen={setOpen} itemId={itemId} image={image} />}
      <div className={style.wrapper}>
        <div className={style.imageContainer}>
          <img
            className={style.image}
            src={`https://gateway.pinata.cloud/ipfs/${image}`}
            alt=""
          />
        </div>
        <div className={style.content}>
          <h1 className={style.h1}>{name}</h1>
          <p className={style.p}>{description}</p>
          <p className={style.p}>
            Seller {shortenAccountAddress(seller ? seller : "")}
          </p>
        </div>
        {sold ? (
          <button onClick={() => setOpen(true)} className={style.button}>
            Resell
          </button>
        ) : seller.toLowerCase() !== connectedAccount?.toLowerCase() ? (
          <button
            onClick={() => buyNFT(itemId, price)}
            className={style.button}
          >
            Buy for {price}ETH
          </button>
        ) : (
          <div className="px-3 mb-2">
            <p className="text-secondary font-bold">You own this item</p>
          </div>
        )}
      </div>
    </>
  );
};

export default NFTItem;
