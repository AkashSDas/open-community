import { SideNavbar } from "../components/common/navbar";
import "../styles/styles.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SideNavbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
