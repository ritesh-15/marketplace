import "../styles/globals.css";
import { UserContextProvider } from "../context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CollectionContextProvider } from "../context/CollectionContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserContextProvider>
        <CollectionContextProvider>
          <Component {...pageProps} />
        </CollectionContextProvider>
      </UserContextProvider>
      <ToastContainer />
    </>
  );
}

export default MyApp;
