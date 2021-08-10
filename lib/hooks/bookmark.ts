import { useEffect, useState } from "react";

import { firestore } from "../firebase";
import { useUserData } from "./user";

export function useBookmark() {
  const { user, username } = useUserData();
  const [bookmark, setBookmark] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let unsubscribe;

    try {
      if (user && username) {
        const query = firestore.collection(`/users/${user.uid}/bookmark`);

        unsubscribe = query.onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map((doc) => {
              return { id: doc.id, data: doc.data() };
            });
            setBookmark(data);
          } else {
            setBookmark([]);
          }
        });
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError({
        error: true,
        message: err,
      });
    }

    return unsubscribe;
  }, [user, username]);

  const bookmarkAction = async (postId: string, authorId: string) => {
    if (user && username) {
      const ref = firestore.doc(`/users/${user.uid}/bookmark/${postId}`);
      if ((await ref.get()).exists) {
        // un-bookmark
        await ref.delete();
      } else {
        // bookmark
        await ref.set({ authorId });
      }
      return { error: false };
    } else {
      return { error: true, message: "user unauthenticated" };
    }
  };

  return { bookmark, loading, error, bookmarkAction };
}
