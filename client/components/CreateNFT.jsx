import React from "react";
import { BsImage } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useCollection } from "../context/CollectionContext";

const CreateNFT = ({ setOpen }) => {
  const {
    handleImageChange,
    nftImage,
    formData,
    handleChange,
    setNftImage,
    handleMint,
    error,
  } = useCollection();

  const handleCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bg-[rgba(115,115,115,0.2)] z-40 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className="bg-primary w-full max-w-[500px] p-4 rounded-lg">
          <h1 className="text-xl font-bold text-white font-nunito">
            Mint Your NFT
          </h1>
          {error && (
            <div className="mt-2 border border-red-500 p-3 rounded-lg w-fit">
              <p className="text-red-500 font-nunito">{error}</p>
            </div>
          )}
          <form className="mt-4" action="">
            <div className="h-[450px] overflow-auto">
              <div className="flex flex-col mb-4">
                <label
                  className="text-white font-lg mb-2 font-nunito"
                  htmlFor=""
                >
                  Name
                </label>
                <input
                  className="text-white font-nunito bg-primary outline-none text-lg border p-4 rounded-lg border-secondary"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
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
                  value={formData.price}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label
                  className="text-white font-lg mb-2 font-nunito"
                  htmlFor=""
                >
                  Description
                </label>
                <textarea
                  className="text-white font-nunito bg-primary outline-none text-lg border p-4 rounded-lg border-secondary resize-none h-[150px]"
                  type="text"
                  name="description"
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              {nftImage ? (
                <div className="w-full relative h-[250px] mb-2 overflow-hidden rounded-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(nftImage)}
                    alt=""
                  />
                  <div
                    onClick={() => setNftImage(null)}
                    className="p-2 cursor-pointer bg-gray-500 absolute right-2 top-2 rounded-full"
                  >
                    <AiOutlineClose className="text-white text-xl" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center mt-6">
                  <BsImage className="text-white text-2xl cursor-pointer" />
                  <label
                    htmlFor="file"
                    className="text-secondary mt-3 cursor-pointer font-nunito"
                  >
                    Choose NFT Image
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 text-secondary font-nunito"
              >
                Cancel
              </button>
              <button
                onClick={handleMint}
                className="bg-secondary font-nunito p-4 flex-1 text-white font-semibold rounded-lg hover:opacity-70 transition-all"
              >
                Mint
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateNFT;
