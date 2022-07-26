import React, { useEffect } from "react";
import Header from "../components/Header";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import { useCollection } from "../context/CollectionContext";
import NFTItem from "../components/NFTItem";

const style = {
  wrapper: "min-h-screen bg-primary pt-36",
  container: "flex flex-col w-full max-w-[1300px] mx-auto justify-between",
  h1: "text-3xl font-bold font-nunito text-white",
  headingDiv: "flex items-center mb-12",
  nftItemsContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  nodata:
    "w-full max-w-[300px] flex-col items-center flex justify-center mx-auto mt-12",
};

const Assets = () => {
  const { connectedAccount } = useUser();
  const router = useRouter();
  const { myNFTs, loadingNFTs } = useCollection();

  useEffect(() => {
    if (!connectedAccount) router.push("/");
  }, [connectedAccount, router]);

  return (
    <>
      <Header />
      <section className={style.wrapper}>
        <div className={style.container}>
          <div className={style.headingDiv}>
            <h1 className={style.h1}>Your Assets</h1>
          </div>
          {loadingNFTs ? (
            <div className="w-full flex justify-center mt-12">
              <div className="loader" />
            </div>
          ) : myNFTs.length ? (
            <div className={style.nftItemsContainer}>
              {myNFTs.map(
                ({
                  name,
                  image,
                  description,
                  price,
                  tokenId,
                  itemId,
                  sold,
                  seller,
                }) => (
                  <NFTItem
                    key={itemId}
                    name={name}
                    image={image}
                    description={description}
                    price={price}
                    tokenId={tokenId}
                    sold={sold}
                    seller={seller}
                    itemId={itemId}
                  />
                )
              )}
            </div>
          ) : (
            <div className={style.nodata}>
              <img
                className="h-[200px] w-[200px] object-fit"
                src="/no_data.svg"
                alt=""
              />
              <h1 className="text-white text-center mt-4 text-xl">
                No collections found to show!
              </h1>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Assets;
