import "../styles/styles.scss";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { SideNavbar } from "../components/common/navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks/user";

/**
 * You should load the stripe-js libary from a script tag only,
 * that's because, in order to be pci compliance you must always
 * pull the latest javascript from stripe.
 *
 * You can go in to the public folder and add the script tag to the
 * head of the html document there, however the stripe libary allows
 * us to handle this automatically from our react code
 *
 * loadStripe will automatically add the script tag to load stripe-js
 * in the head of the document. The stripePromise will async load stripe
 * and makes it available in our app
 *
 * Element is a provider that allows us to access the stripe react UI
 * components in our react app
 */

export const stripePromise = loadStripe(
  "pk_test_51HXMD3IW9OOyJTj3RzGrjxcy8UDAisfUcV9jyk47XGTKjMcs98VnjPPH2YEKOFfRZFmxtsKVowyAoUc2cTFRklm400sOAzw2Th"
);

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <SideNavbar />
      <Elements stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </UserContext.Provider>
  );
}

export default MyApp;
