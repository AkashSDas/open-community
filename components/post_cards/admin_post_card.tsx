import { useState } from "react";
import { useEffect } from "react";
import { auth, firestore, postToJSON } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";

// Max post to query per page
const LIMIT = 10;

function AdminPostCard(props) {
  const { user } = useUserData();
  const [posts, setPosts] = useState([]);

  if (!user) return <main>Loading...</main>;

  const getPost = async () => {
    const postQuery = firestore
      .collection("/posts")
      .where("authorId", "==", user.uid)
      .limit(LIMIT);

    const postsData = await postQuery.get();

    postsData.docs.map(async (doc) => {
      const data = doc.data();

      const metadataDoc = firestore.doc(`postMetadata/${data.metadataId}`);
      const metadataData = (await metadataDoc.get()).data();
      const postData = {
        ...data,
        metadataData,
      };

      setPosts((postList) => [...postList, postData]);
    });
  };

  //   getPost();

  return (
    <section>
      <div className="heading">Your Posts</div>
      <hr />

      {JSON.stringify(posts)}
    </section>
  );
}

// export async function getServerSideProps(context) {
//   const postQuery = firestore
//     .collection("/posts")
//     .where("authorId", "==", auth.currentUser.uid)
//     .limit(LIMIT);

//   const posts = await postQuery.get();

//   return {
//     props: { posts },
//   };
// }

export default AdminPostCard;
