import { useState } from "react";

import { firestore, fromMillis, serializePostDocData } from "../../firebase";

export function useAuthorMorePostsDataOnce(
  authorId: string,
  posts: any,
  limit: number
) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(posts);
  const [postEnds, setPostEnds] = useState(false);

  const getData = async () => {
    setLoading(true);

    try {
      const last = data[data.length - 1];

      const cursor =
        typeof last.post.data.lastmodifiedAt === "number"
          ? fromMillis(last.post.data.lastmodifiedAt)
          : last.post.data.lastmodifiedAt;

      const postQuery = firestore
        .collection("posts")
        .where("authorId", "==", authorId)
        .orderBy("lastmodifiedAt", "desc")
        .startAfter(cursor)
        .limit(limit);

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

        //   const authorQuery = firestore.doc(`/users/${p.data.authorId}`);
        //   const author = (await authorQuery.get()).data();

        posts.push({
          post: p,
          metadata,
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
      }

      if (postsData.length < limit) {
        setLoading(false);

        // we've retrieved all the posts from firestore
        setPostEnds(true);
      }
    } catch (err) {
      setLoading(false);
      setError({
        error: true,
        message: err,
      });
    }
  };

  return { data, loading, error, getData, postEnds };
}
