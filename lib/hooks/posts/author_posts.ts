import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { firestore, fromMillis, serializePostDocData } from "../../firebase";

export function useAuthorPostsDataOnce(limit: number) {
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [postEnds, setPostEnds] = useState(false);
  const router = useRouter();
  const [authorName, setAuthorName] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const loadingState = (userCursor: boolean, state: boolean) => {
    if (userCursor) {
      setLoadMoreLoading(state);
    } else {
      setPageLoading(state);
    }
  };

  const getData = async (useCursor = false) => {
    if (authorName) {
      loadingState(useCursor, true);

      try {
        const authorQuery = firestore
          .collection("users")
          .where("username", "==", authorName)
          .limit(1);

        const author = (await authorQuery.get()).docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        });

        if (author.length === 0) {
          // author doesn't exists
          setAuthorInfo(null);
          loadingState(useCursor, false);
        } else {
          const authorData = author[0];
          console.log(authorData);

          setAuthorInfo(authorData);

          const last = data[data.length - 1];
          let postQuery = firestore
            .collection("/posts")
            .where("authorId", "==", authorData.id)
            .orderBy("lastmodifiedAt", "desc")
            .limit(limit);

          if (useCursor) {
            const cursor =
              typeof last.post.lastmodifiedAt === "number"
                ? fromMillis(last.post.lastmodifiedAt)
                : last.post.lastmodifiedAt;

            postQuery = firestore
              .collection("/posts")
              .where("authorId", "==", authorData.id)
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

            //   const authorQuery = firestore.doc(`/users/${p.data.authorId}`);
            //   const author = (await authorQuery.get()).data();

            posts.push({
              id: p.id,
              post: p.data,
              metadata,
              author,
            });

            if (count === postsData.length - 1) {
              // we've reached the end of docs
              setData((data) => [...data, ...posts]);
              loadingState(useCursor, false);

              // resetting the counter
              count = 0;
            } else {
              count++;
            }
          }

          if (postsData.length < limit) {
            loadingState(useCursor, false);

            // we've retrieved all the posts from firestore
            setPostEnds(true);
          }
        }
      } catch (error) {
        loadingState(useCursor, false);
        setError({
          error: true,
          message: error,
        });
      }
    }
  };

  useEffect(() => {
    getData();
  }, [authorName]);

  useEffect(() => {
    if (router.query?.username) {
      setAuthorName(router.query.username);
    }
  }, [router.query]);

  return {
    author: authorInfo,
    data,
    pageLoading,
    loadMoreLoading,
    error,
    postEnds,
    getData,
  };
}
