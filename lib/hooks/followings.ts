import { useEffect, useState } from "react";

import { firestore } from "../firebase";
import { useUserData } from "./user";

export function useFollowingAuthors() {
  const { user, username } = useUserData();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);

    let unsubscribeAuthorsCollection;

    try {
      if (user && username) {
        const query = firestore.collection(`/users/${user.uid}/followings`);

        unsubscribeAuthorsCollection = query.onSnapshot((snapshot) => {
          if (!snapshot.empty) {
            const authorsData = snapshot.docs.map((doc) => {
              return { id: doc.id, data: doc.data() };
            });
            setAuthors(authorsData);
          } else {
            setAuthors([]);
          }
        });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
    }

    return unsubscribeAuthorsCollection;
  }, [user, username]);

  const followAction = async (authorId: string, authorName: string) => {
    if (user && username) {
      const ref = firestore.doc(`/users/${user.uid}/followings/${authorId}`);
      if ((await ref.get()).exists) {
        // unfollow
        await ref.delete();
      } else {
        // follow
        await ref.set({ authorName });
      }
      return { error: false };
    } else {
      return { error: true, message: "user unauthenticated" };
    }
  };

  return { followings: authors, loading, error, followAction };
}
