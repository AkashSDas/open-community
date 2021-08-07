import { useEffect, useState } from "react";

import { firestore } from "../../lib/firebase";
import ShowSVG from "../svg_icons/show";

interface State {
  post: any;
  metadata: any;
  id: string;
  authorInfo: any;
}

function BigPostWithMostHeartsCard() {
  const [mostHeartedPost, setMostHeatedPost] = useState<State>(null);

  const getMostHeartedPost = async () => {
    const metadataQuery = firestore
      .collection("postMetadata")
      .orderBy("hearts")
      .limit(1);

    const metadataDoc = (await metadataQuery.get()).docs[0];

    const postQuery = firestore.doc(`/posts/${metadataDoc.id}`);
    const postDoc = await postQuery.get();
    let post = postDoc.data();

    // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    post = {
      ...post,
      createdAt: post?.createdAt?.toMillis() || 0,
      lastmodifiedAt: post?.lastmodifiedAt?.toMillis() || 0,
    };

    const authorQuery = firestore.doc(`/users/${post.authorId}`);
    const authorDoc = await authorQuery.get();

    setMostHeatedPost({
      metadata: metadataDoc.data(),
      post,
      id: postDoc.id,
      authorInfo: authorDoc.data(),
    });
  };

  useEffect(() => {
    getMostHeartedPost();
  }, []);

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

  // show loading card animation
  if (!mostHeartedPost) return <div></div>;

  return (
    <div>
      <div className="cover-img">
        <img
          src={mostHeartedPost.post.coverImgURL}
          alt={mostHeartedPost.post.title}
        />
        <div className="read-time">{mostHeartedPost.metadata.readTime} min</div>
      </div>

      <div className="info">
        <h4>{mostHeartedPost.post.title}</h4>
        <div className="description">{mostHeartedPost.post.description}</div>
        <div className="author-info">
          <div className="img">
            <img
              src={mostHeartedPost.authorInfo.photoURL}
              alt={mostHeartedPost.authorInfo.username}
            />
          </div>
          <div className="info">
            <div className="author-name">
              {mostHeartedPost.authorInfo.username}
            </div>
            <div className="post-info">
              <span>
                {convertSecToJsxTime(mostHeartedPost.post.lastmodifiedAt)}
              </span>
              <span className="space">-</span>
              <span className="views">
                <ShowSVG /> {mostHeartedPost.post.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BigPostWithMostHeartsCard;
