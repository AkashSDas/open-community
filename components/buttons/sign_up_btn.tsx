import { auth, googleAuthProvider } from "../../lib/firebase";
import GoogleSVG from "../svg_icons/google";

export function SignUpWithGoogle() {
  const signup = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button onClick={signup} className="sign-up-with-google-btn">
      <GoogleSVG /> Sign up with Google
    </button>
  );
}
