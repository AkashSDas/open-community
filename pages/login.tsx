import { useRouter } from "next/router";

import { SignUpWithGoogle } from "../components/buttons/sign_up_btn";
import HeadingWithIcon from "../components/common/heading_with_icon";
import GoogleSVG from "../components/svg_icons/google";
import UserSVG from "../components/svg_icons/user";
import { auth, googleAuthProvider } from "../lib/firebase";

function Login() {
  const router = useRouter();

  const signup = async () => {
    const user = await auth.signInWithPopup(googleAuthProvider);
    router.push("/");
  };

  // currently there is no checking if the user had account or not
  // so redirect user to sign up page if the user doesn't have an account

  return (
    <main>
      <HeadingWithIcon icon={<UserSVG />} text="Login" />

      <section className="login-section">
        <div className="info">
          Currently login through Google is only available
        </div>
        <button onClick={signup} className="sign-up-with-google-btn">
          <GoogleSVG /> Sign up with Google
        </button>
      </section>
    </main>
  );
}

export default Login;
