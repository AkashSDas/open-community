import { useEffect, useState } from "react";

import { firestore, serializePostDocData } from "../../firebase";

export function useMostHeartedPostDataOnce() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = async () => {
    setLoading(true);

    try {
      const metadataQuery = firestore
        .collection("/postMetadata")
        .orderBy("hearts", "desc")
        .limit(1);

      // getting first (and only) doc
      const metadataDoc = (await metadataQuery.get()).docs[0];
      const metadata = metadataDoc.data();

      const postQuery = firestore.doc(`/posts/${metadataDoc.id}`);
      const post = serializePostDocData(await postQuery.get());

      const authorQuery = firestore.doc(`/users/${post.authorId}`);
      const author = (await authorQuery.get()).data();

      setData({
        metadata,
        post,
        author,
      });
      setLoading(false);
    } catch (error) {
      setError({
        error: true,
        message: error,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return { data, loading, error };
}
