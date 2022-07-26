import React, { useState } from "react";
import Image from "next/image";
import { useCollection } from "../context/CollectionContext";

const ResellNFT = ({ setOpen, itemId, image }) => {
  const { resellNFT } = useCollection();

  const [price, setPrice] = useState("");

  const handleChange = (e) => {
    setPrice(e.target.value);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bg-[rgba(115,115,115,0.2)] z-40 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className="bg-primary w-full max-w-[500px] p-4 rounded-lg">
          <h1 className="text-xl font-bold text-white font-nunito">
            Resell your NFT
          </h1>

          <div className="mt-4 w-fit mx-auto overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={`https://gateway.pinata.cloud/ipfs/${image}`}
              alt=""
              width={300}
              height={150}
              objectFit="contain"
            />
          </div>

          <form className="mt-4" action="">
            <div className="overflow-auto">
              <div className="flex flex-col mb-4">
                <label
                  className="text-white font-lg mb-2 font-nunito"
                  htmlFor=""
                >
                  Price (in ETH)
                </label>
                <input
                  className="text-white font-nunito bg-primary outline-none text-lg border p-4 rounded-lg border-secondary"
                  type="text"
                  name="price"
                  onChange={handleChange}
                  value={price}
                />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 text-secondary font-nunito"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  resellNFT(itemId, price);
                }}
                className="bg-secondary font-nunito p-4 flex-1 text-white font-semibold rounded-lg hover:opacity-70 transition-all"
              >
                Resell
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResellNFT;
