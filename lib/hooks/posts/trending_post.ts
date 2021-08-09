import { useEffect, useState } from "react";

import { firestore, serializePostDocData } from "../../firebase";

export function useTrendingPostDataOnce(top: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = async () => {
    setLoading(true);

    try {
      const metadataQuery = firestore
        .collection("/postMetadata")
        .orderBy("views", "desc")
        .limit(top);

      const metadata = (await metadataQuery.get()).docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });

      const posts = [];
      for await (const md of metadata) {
        const postQuery = firestore.doc(`/posts/${md.id}`);
        const post = serializePostDocData(await postQuery.get());

        const authorQuery = firestore.doc(`/users/${post.authorId}`);
        const author = (await authorQuery.get()).data();

        posts.push({
          id: md.id,
          post,
          metadata: { ...md.data },
          author,
        });
      }

      setData(posts);
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
