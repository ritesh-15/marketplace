import Link from "next/link";
import { useUser } from "../context/UserContext";
import { shortenAccountAddress } from "../utils/shortenAccountAddress";

const style = {
  navWrapper:
    "flex items-center bg-primary fixed left-0 top-0 z-20 right-0 justify-between max-w-[1300px] mx-auto py-4",
  navLogoWrapper: "flex items-center justify-center",
  navLogoHeading: "text-white font-bold font-nunito text-2xl cursor-pointer",
  ul: "flex items-center flex-1 justify-end",
  li: "flex items-center px-4 text-white font-nunito cursor-pointer hover:text-secondary transition",
  connectWallet:
    "p-3 rounded-lg text-white font-nunito bg-secondary hover:opacity-70 transition-all",
  connectAccount: "border border-gray-700 px-4 py-2 rounded-lg",
  connectAccountHeading: "text-lg font-semibold font-nunito text-green-500",
  address: "text-white font-nunito",
};

const Header = () => {
  const { connectedAccount, connectWallet } = useUser();

  return (
    <nav className={style.navWrapper}>
      <div className={style.navLogoWrapper}>
        <Link href="/">
          <h1 className={style.navLogoHeading}>NFTMarket</h1>
        </Link>
      </div>

      <ul className={style.ul}>
        <li className={style.li}>
          <Link href="/explore">Explore</Link>
        </li>
        <li className={style.li}>
          <Link href="/assets">My Assets</Link>
        </li>
        {!connectedAccount ? (
          <li className={style.li}>
            <button onClick={connectWallet} className={style.connectWallet}>
              Connect Wallet
            </button>
          </li>
        ) : (
          <li className={style.li}>
            <div className={style.connectAccount}>
              <h1 className={style.connectAccountHeading}>Wallet connected!</h1>
              <p className={style.address}>
                {shortenAccountAddress(connectedAccount)}
              </p>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
