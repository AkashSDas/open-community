import { Dispatch, SetStateAction, useState } from "react";
import { SignUpWithGoogle } from "../components/buttons/sign_up_btn";
import HeadingWithIcon from "../components/common/heading_with_icon";
import LogoSVG from "../components/svg_icons/logo";
import UserPlusSVG from "../components/svg_icons/user_plus";

function SignUp() {
  return (
    <main>
      <HeadingWithIcon icon={<UserPlusSVG />} text="Sign Up" />
      <SignUpCard />
    </main>
  );
}

function SignUpCard() {
  const [signUpInfo, setSignUpInfo] = useState({
    displaySection: 0,
    hasSignedUp: false,
  });

  const displaySection = () => {
    if (signUpInfo.displaySection === 0)
      return <Section1 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />;

    if (signUpInfo.displaySection === 1) {
      return <div></div>;
    }

    if (signUpInfo.displaySection === 2) {
      return <div></div>;
    }

    if (signUpInfo.displaySection === 3) {
      return <div></div>;
    }
  };

  return (
    <section className="sign-up-section">
      <Slider sectionId={signUpInfo.displaySection} />
      {displaySection()}
    </section>
  );
}

interface Section1Props {
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

function Section1({ signUpInfo, setSignUpInfo }: Section1Props) {
  return (
    <div className="section-1">
      <div className="title">Choose your authentication mode</div>
      <SignUpWithGoogle signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />

      <div className="helper">
        <div>
          <div>No account, Create one.</div>
          <div>
            Currently sign up through <span>Google</span> is only avaliable.
          </div>
        </div>
        <LogoSVG />
      </div>
    </div>
  );
}

function Slider(props: { sectionId: number }) {
  return (
    <div className="slider">
      {[0, 1, 2, 3].map((spanNum: number, key: number) => (
        <span
          key={key}
          className={spanNum === props.sectionId ? "active" : "inactive"}
        ></span>
      ))}
    </div>
  );
}

export default SignUp;
