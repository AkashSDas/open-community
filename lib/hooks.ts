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
