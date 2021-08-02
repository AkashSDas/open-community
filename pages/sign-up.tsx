import HeadingWithIcon from "../components/common/heading_with_icon";
import UserPlusSVG from "../components/svg_icons/user_plus";

function SignUp() {
  return (
    <main>
      <HeadingWithIcon icon={<UserPlusSVG />} text="Sign Up" />
    </main>
  );
}

export default SignUp;
