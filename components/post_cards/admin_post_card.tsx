import { useState } from "react";
import { useEffect } from "react";
import { auth, firestore, postToJSON } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";
import ShowSVG from "../svg_icons/show";

// Max post to query per page
const LIMIT = 10;

function AdminPostCard(props) {
  const { user } = useUserData();
  const [posts, setPosts] = useState([]);

  const getPost = async () => {
    const postQuery = firestore
      .collection("/posts")
      .where("authorId", "==", user.uid)
      .orderBy("lastmodifiedAt", "desc")
      .limit(LIMIT);

    const postsData = await postQuery.get();
    const postList = [];
    let count = 0;
    postsData.docs.map(async (doc) => {
      let data = doc.data();
      console.log(data);
      // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
      data = {
        ...data,
        createdAt: data?.createdAt?.toMillis() || 0,
        lastmodifiedAt: data?.lastmodifiedAt?.toMillis() || 0,
      };

      const metadataDoc = firestore.doc(`postMetadata/${data.metadataId}`);
      const metadataData = (await metadataDoc.get()).data();

      const postData = {
        ...data,
        ...metadataData,
      };

      postList.push(postData);

      /// to make setPosts run only when we have iterated through
      /// entire docs
      if (count === postsData.docs.length - 1) {
        setPosts(postList);
        count = 0;
      } else {
        count++;
      }
    });
  };

  useEffect(() => {
    if (user) {
      (async () => await getPost())();
    }
  }, [user]);

  if (!user) return <main>Loading...</main>;

  return (
    <section className="admin-posts">
      <div className="heading">Your Posts</div>
      <div className="hr"></div>

      {posts && posts.map((post, key) => <Card key={key} post={post} />)}
    </section>
  );
}

function Card({ post }) {
  const convertSecToJsxTime = (time) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(time);
    return `${date.getDay()} ${monthNames[date.getMonth()].slice(
      0,
      3
    )}, ${date.getFullYear()}`;
  };

  return (
    <div className="admin-post-card">
      <img className="cover-img" src={`${post.coverImgURL}`} />
      <div className="info">
        <h4>{post.title}</h4>
        <div className="description">{post.description}</div>
        <div className="other-info">
          <span>
            <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
            {post.publish ? <span className="space">-</span> : null}
            {post.publish ? (
              <span className="views">
                <ShowSVG /> {post.views}
              </span>
            ) : null}
          </span>

          <span className="action-btns">
            {post.publish ? (
              <span>
                <button>Publish</button>
              </span>
            ) : null}
            <span>
              <button>Edit</button>
            </span>
            <span>
              <button>Delete</button>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminPostCard;
