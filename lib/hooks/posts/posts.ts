import { useEffect, useState } from "react";

import { firestore, fromMillis, serializePostDocData } from "../../firebase";

export function usePostDataOnce(limit: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [postEnds, setPostEnds] = useState(false);

  const getData = async (useCursor = false) => {
    setLoading(true);

    try {
      const last = data[data.length - 1];
      let postQuery = firestore
        .collection("/posts")
        .orderBy("lastmodifiedAt", "desc")
        .limit(limit);

      if (useCursor) {
        const cursor =
          typeof last.post.lastmodifiedAt === "number"
            ? fromMillis(last.post.lastmodifiedAt)
            : last.post.lastmodifiedAt;

        postQuery = firestore
          .collection("/posts")
          .orderBy("lastmodifiedAt", "desc")
          .startAfter(cursor)
          .limit(limit);
      }

      const postsData = (await postQuery.get()).docs.map((doc) => {
        return {
          id: doc.id,
          data: serializePostDocData(doc),
        };
      });

      let posts = [];
      let count = 0;
      for await (const p of postsData) {
        const metadataQuery = firestore.doc(`/postMetadata/${p.id}`);
        const metadata = (await metadataQuery.get()).data();

        const authorQuery = firestore.doc(`/users/${p.data.authorId}`);
        const author = (await authorQuery.get()).data();

        posts.push({
          id: p.id,
          post: p.data,
          metadata,
          author,
        });

        if (count === postsData.length - 1) {
          // we've reached the end of docs
          setData((data) => [...data, ...posts]);
          setLoading(false);

          // resetting the counter
          count = 0;
        } else {
          count++;
        }

        console.log(postsData.length);
      }

      if (postsData.length < limit) {
        setLoading(false);

        // we've retrieved all the posts from firestore
        setPostEnds(true);
      }
    } catch (error) {
      setLoading(false);
      setError({
        error: true,
        message: error,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    data,
    loading,
    error,
    postEnds,
    getData,
  };
}
