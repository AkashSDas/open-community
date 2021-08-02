import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck(props: {
  children: JSX.Element;
  fallback?: JSX.Element;
}) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href="/sign-up">You must be signed in</Link>;
}
