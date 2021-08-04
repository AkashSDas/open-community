import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

/**
 * Custom hook to read auth record and user profile doc
 */
export function useUserData() {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState<string>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}

/// Resize textarea height dynamically
///
/// NOTE: If you've a case where your textarea is mounting & unmounting
/// but not your main component where you've defined this hook then extract
/// textarea into separate hook and that way you can use the lifecycle
/// events (mounting and unmounting) of the textarea and not the top component
/// where this hook is defined. If you don't do this then textare if
/// having default `value` will have height that'll fit the content but as
/// the textarea is unmounted (not the top component where this hook is defined)
/// and then mounted again, now the height will be default textarea height and
/// this might not fit your content and then you've to scroll.
/// Similar situation was faced in `editor-mode-0` in post_form.tsx
export function useResizeTextareaHeight(value: string) {
  const ref = useRef(null);

  // Whenever the value updates the height will update
  useEffect(() => {
    ref.current.style.height = "0px";
    const scrollHeight = ref.current.scrollHeight;
    ref.current.style.height = scrollHeight + "px";
  }, [value]);

  return { ref };
}
