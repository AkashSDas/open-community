import debounce from "lodash.debounce";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";

import { SignUpWithGoogle } from "../components/buttons/sign_up_btn";
import HeadingWithIcon from "../components/common/heading_with_icon";
import LogoSVG from "../components/svg_icons/logo";
import UserPlusSVG from "../components/svg_icons/user_plus";
import { UserContext } from "../lib/context";
import { firestore } from "../lib/firebase";

function SignUp() {
  return (
    <main>
      <HeadingWithIcon icon={<UserPlusSVG />} text="Sign Up" />
      <SignUpCard />
    </main>
  );
}

function SignUpCard() {
  const { user, username } = useContext(UserContext);

  const [signUpInfo, setSignUpInfo] = useState({
    displaySection: user ? (username ? 2 : 1) : 0,
    hasSignedUp: false,
  });

  const displaySection = () => {
    if (signUpInfo.displaySection === 0)
      return <Section1 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />;

    if (signUpInfo.displaySection === 1) {
      return <Section2 signUpInfo={signUpInfo} setSignUpInfo={setSignUpInfo} />;
    }

    if (signUpInfo.displaySection === 2) {
      return <Section3 />;
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

function Section2({ signUpInfo, setSignUpInfo }: Section1Props) {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
      email: user.email,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();

    setSignUpInfo({
      displaySection: user && username ? 2 : user ? 1 : 0,
      hasSignedUp: user && username ? true : false,
    });
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Username should have more than 3 chars and should pass the regex test

    // Allowing user to enter value even if it is less than 3
    // but that value will be not valid
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    // Check the regex pattern
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  // debounce will prevent the execution of this func until the last event
  // has stopped firing or the last form value is changed after a delay of
  // 500ms.
  // useCallback is required for debounce to work because anytime React
  // re-renders it creates a new func obj which will not be debounced, whereas
  // useCallback memoize the func so that it can easily debounce between state
  // changes
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const debugText = () => {
    return (
      <>
        Username: {formValue} <br />
        Loading: {loading.toString()} <br />
        Username Valid: {isValid.toString()}
      </>
    );
  };

  const usernameMessage = () => {
    if (loading) return <p className="checking">Checking...</p>;
    if (isValid)
      return <p className="text-success">{formValue} is avaliable!</p>;
    if (formValue && !isValid)
      return <p className="text-danger">That username is taken</p>;
    return <p></p>;
  };

  return (
    <section className="section-2">
      <div className="title">Choose your username</div>

      <form onSubmit={onSubmit}>
        {/* <label>Username</label> */}
        <input
          type="text"
          name="username"
          value={formValue}
          onChange={onChange}
          placeholder="Enter username"
        />
        <div className="username-msg">{usernameMessage()}</div>
        <button type="submit" disabled={!isValid} className="simple-btn">
          Submit
        </button>
      </form>
    </section>
  );
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
      {[0, 1, 2].map((spanNum: number, key: number) => (
        <span
          key={key}
          className={spanNum === props.sectionId ? "active" : "inactive"}
        ></span>
      ))}
    </div>
  );
}

export default SignUp;

function Section3() {
  return (
    <div className="section-3">
      <div>
        <div className="greeting-card">
          <div className="greeting">Congratulations</div>
          <div className="msg">Your account has been created successfully</div>
        </div>
        <button className="simple-btn">Explore</button>
      </div>
      <LogoSVG />
    </div>
  );
}
