import Link from "next/link";
import { useEffect, useState } from "react";
import CreateNFT from "../components/CreateNFT";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { useCollection } from "../context/CollectionContext";
import { useUser } from "../context/UserContext";

const style = {
  wrapper: "min-h-screen bg-primary flex items-center justify-between",
  container:
    "flex flex-col-reverse md:flex-row w-full max-w-[1300px] mx-auto justify-between",
  heroContent: "flex flex-col",
  heroImage: "w-full max-w-[450px]",
  h1: "text-white font-bold text-4xl w-3/4 mb-4 font-nunito",
  p: "text-white text-2xl w-2/4 font-nunito",
  heroAction: "flex items-center mt-6",
  explore:
    "text-white bg-secondary p-4 flex-1 transition-all max-w-[200px] rounded-lg hover:opacity-70 font-nunito",
  create:
    "text-secondary font-nunito bg-primary border border-secondary p-4 flex-1 max-w-[200px] ml-4 rounded-lg",
  image: "w-full h-full object-fit",
};

const Home = () => {
  const [open, setOpen] = useState(false);
  const { minting, minted } = useCollection();
  const { connectedAccount } = useUser();

  useEffect(() => {
    if (!minted) return;
    setOpen(false);
  }, [minted]);

  return (
    <>
      <Header />
      {open && <CreateNFT setOpen={setOpen} />}
      {minting && <Loader />}
      <section className={style.wrapper}>
        <div className={style.container}>
          <div>
            <h1 className={style.h1}>
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <p className={style.p}>
              NFTMarket is the worlds first and largest NFT marketplace
            </p>
            <div className={style.heroAction}>
              <Link href="/explore">
                <button className={style.explore}>Explore</button>
              </Link>
              {connectedAccount && (
                <button onClick={() => setOpen(true)} className={style.create}>
                  Create
                </button>
              )}
            </div>
          </div>
          <div className={style.heroImage}>
            <img className={style.image} src="/hero_image.svg" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
