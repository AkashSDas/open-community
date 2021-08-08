import "../styles/styles.scss";

import { SideNavbar } from "../components/common/navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks/user";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <SideNavbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
