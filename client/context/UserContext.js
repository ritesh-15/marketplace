import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

let eth = null;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState(null);

  const connectWallet = async () => {
    if (!eth) return;

    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setConnectedAccount(accounts[0]);
    } catch (error) {
      toast.error("Could not connect to wallet");
    }
  };

  const checkIfWalletConnected = async () => {
    if (!eth) return;

    try {
      const accounts = await eth.request({ method: "eth_accounts" });
      setConnectedAccount(accounts[0]);
    } catch (error) {
      toast.error("Could not connect to wallet");
    }
  };

  const disconnectAccount = () => {
    setConnectedAccount(null);
  };

  useEffect(() => {
    const eth = window.ethereum;

    if (!eth) {
      console.log("No ethereum provider found!");
      return;
    }

    checkIfWalletConnected();

    window.ethereum.on("connect", connectWallet);

    window.ethereum.on("accountsChanged", (accounts) => {
      setConnectedAccount(accounts[0]);
    });

    window.ethereum.on("disconnect", disconnectAccount);

    return () => {
      ethereum.removeListener("accountsChanged", () => {});
      ethereum.removeListener("disconnect", () => {});
      ethereum.removeListener("connect", () => {});
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        connectWallet,
        connectedAccount,
        checkIfWalletConnected,
        disconnectAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
