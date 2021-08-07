import { useEffect, useState } from "react";

import Greeting from "../components/common/greeting";
import BigPostWithMostHeartsCard from "../components/home/big_post_with_most_hearts_card";
import LogoSVG from "../components/svg_icons/logo";
import ShowSVG from "../components/svg_icons/show";
import { firestore, fromMillis } from "../lib/firebase";
import { convertSecToJsxTime } from "../lib/utils";

function Index() {
  return (
    <main className="home">
      <Greeting />
      <HomePageTopSection />
      <hr />
      <TrendingSection />
      <hr />
      <PostListView />
    </main>
  );
}

function PostListView() {
  const [posts, setPosts] = useState([]);
  const LIMIT = 2;

  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor =
      typeof last.lastmodifiedAt === "number"
        ? fromMillis(last.lastmodifiedAt)
        : last.modifiedAt;

    const postQuery = firestore
      .collection("/posts")
      .orderBy("lastmodifiedAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const postsData = await postQuery.get();
    const postList = [];
    let count = 0;

    if (postsData.docs.length !== 0) {
      postsData.docs.map(async (doc) => {
        let data = doc.data();
        // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        data = {
          ...data,
          createdAt: data?.createdAt?.toMillis() || 0,
          lastmodifiedAt: data?.lastmodifiedAt?.toMillis() || 0,
        };

        const metadataDoc = firestore.doc(`postMetadata/${doc.id}`);
        const metadataData = (await metadataDoc.get()).data();

        const postData = {
          id: doc.id,
          ...data,
          ...metadataData,
        };

        postList.push(postData);

        /// to make setPosts run only when we have iterated through
        /// entire docs
        if (count === postsData.docs.length - 1) {
          setPosts((allPosts) => [...allPosts, ...postList]);
          setLoading(false);

          if (postsData.docs.length < LIMIT) setPostsEnd(true);
          count = 0;
        } else {
          count++;
        }
      });
    } else {
      setLoading(false);
      setPostsEnd(true);
    }
  };

  const getPost = async () => {
    const postQuery = firestore
      .collection("/posts")
      .orderBy("lastmodifiedAt", "desc")
      .limit(LIMIT);

    const postsData = await postQuery.get();
    const postList = [];
    let count = 0;
    postsData.docs.map(async (doc) => {
      let data = doc.data();
      // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
      data = {
        ...data,
        createdAt: data?.createdAt?.toMillis() || 0,
        lastmodifiedAt: data?.lastmodifiedAt?.toMillis() || 0,
      };

      const metadataDoc = firestore.doc(`postMetadata/${doc.id}`);
      const metadataData = (await metadataDoc.get()).data();

      const postData = {
        id: doc.id,
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
    (async () => await getPost())();
  }, []);

  return (
    <section className="post-listview">
      {posts && posts.map((post, key) => <PostCard key={key} post={post} />)}

      {posts.length !== 0 && !loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      {loading && <div>Loading...</div>}

      {postsEnd && "You have reached the end!"}
    </section>
  );
}

function PostCard({ post }) {
  return (
    <div className="post-card">
      <img className="cover-img" src={`${post.coverImgURL}`} />
      <div className="info">
        <h4>{post.title}</h4>
        <div className="description">{post.description}</div>
        <div className="other-info">
          <span>
            <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
            <span className="space">-</span>
            <span className="views">
              <ShowSVG /> {post.views} views
            </span>
            <span className="space">-</span>
            <div className="read-time">{post.readTime}min read</div>
          </span>
        </div>
      </div>
    </div>
  );
}

function TrendingSection() {
  const [trendingPosts, setTrendingPosts] = useState(null);

  const getTrendingPosts = async (top: number) => {
    const query = firestore
      .collection("postMetadata")
      .orderBy("views", "desc")
      .limit(top);

    const metadata = (await query.get()).docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    const posts = [];
    for await (const obj of metadata) {
      const postQuery = firestore.doc(`/posts/${obj.id}`);
      let postData = (await postQuery.get()).data();
      postData = {
        ...postData,
        createdAt: postData?.createdAt?.toMillis() || 0,
        lastmodifiedAt: postData?.lastmodifiedAt?.toMillis() || 0,
      };

      const authorQuery = firestore.doc(`/users/${postData.authorId}`);
      const authorDoc = await authorQuery.get();

      posts.push({
        id: obj.id,
        metadata: obj.data,
        post: postData,
        author: authorDoc.data(),
      });
    }

    setTrendingPosts(posts);
  };

  useEffect(() => {
    getTrendingPosts(5);
  }, []);

  return (
    <section className="trending-section">
      <h4>Trending on Open Community</h4>

      {trendingPosts && (
        <div className="posts">
          {trendingPosts.map((post, key: number) => (
            <div key={key} className="trending-post-card">
              <div className="number">0{key + 1}</div>
              <div className="info">
                <div className="author-info">
                  <img
                    src={`${post.author.photoURL}`}
                    alt={`${post.author.username}`}
                  />
                  <div className="username">{post.author.username}</div>
                </div>
                <div className="title">{post.post.title}</div>
                <div className="metadata">
                  {convertSecToJsxTime(post.post.lastmodifiedAt)}
                  <span className="space">-</span>
                  <ShowSVG /> {post.metadata.views} views
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function HomePageTopSection() {
  return (
    <section className="top-section">
      <BigPostWithMostHeartsCard />

      <aside className="aside">
        <div className="explore">
          <div className="heading">Explore your taste</div>

          <div className="tag-btns">
            <TagButton text="accounting" />
            <TagButton text="stock-market" />
            <TagButton text="ipo" />
            <TagButton text="finance" />
            <TagButton text="web-dev" />
            <TagButton text="cloud-computing" />
            <TagButton text="sports" />
            <TagButton text="nutrition" />
            <TagButton text="health" />
          </div>

          <div className="see-more">See more topics!</div>
        </div>

        <div className="promotion">
          <div className="info">
            <h4>Teaching is to learn twice</h4>
            <div className="tag-line">
              Start writing today and Shape the future
            </div>
            <button>Start writing</button>
          </div>

          <div className="mask"></div>

          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
            alt=""
          />

          <LogoSVG />
        </div>
      </aside>
    </section>
  );
}

function TagButton(props: { text: string }) {
  return <button className="tag-btn">#{props.text}</button>;
}

export default Index;
