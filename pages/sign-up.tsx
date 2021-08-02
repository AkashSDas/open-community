import { useState } from "react";
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
  const [sectionId, setSectionId] = useState(0);

  const displaySection = () => {
    if (sectionId === 0) {
      return (
        <div className="section-1">
          <div className="title">Choose your authentication mode</div>
          <SignUpWithGoogle />

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

    if (sectionId === 1) {
      return <div></div>;
    }

    if (sectionId === 2) {
      return <div></div>;
    }

    if (sectionId === 3) {
      return <div></div>;
    }
  };

  return (
    <section className="sign-up-section">
      <Slider sectionId={sectionId} />
      {displaySection()}
    </section>
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
