import { Dispatch, SetStateAction } from "react";
import { auth, googleAuthProvider } from "../../lib/firebase";
import GoogleSVG from "../svg_icons/google";

interface Props {
  signUpInfo: {
    displaySection: number;
    hasSignedUp: boolean;
  };
  setSignUpInfo: Dispatch<
    SetStateAction<{
      displaySection: number;
      hasSignedUp: boolean;
    }>
  >;
}

export function SignUpWithGoogle(props: Props) {
  const signup = async () => {
    const user = await auth.signInWithPopup(googleAuthProvider);
    props.setSignUpInfo({
      displaySection: user ? 1 : 0,
      hasSignedUp: user ? true : false,
    });
  };

  return (
    <button onClick={signup} className="sign-up-with-google-btn">
      <GoogleSVG /> Sign up with Google
    </button>
  );
}
