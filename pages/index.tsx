import { useEffect, useState } from "react";

import Greeting from "../components/common/greeting";
import ExploreTags from "../components/home/explore_tags";
import BigPostCard from "../components/post_cards/big_post_card";
import LogoSVG from "../components/svg_icons/logo";
import ShowSVG from "../components/svg_icons/show";
import { firestore, fromMillis } from "../lib/firebase";
import { useMostHeartedPostDataOnce } from "../lib/hooks/posts/most_hearted_post";
import { useUserData } from "../lib/hooks/user";
import { convertSecToJsxTime } from "../lib/utils";

function Index() {
  return (
    <main className="home">
      <Greeting />
      <HomePageTopSection />
      <hr />
      {/* <TrendingSection /> */}
      <hr />
      <div className="postlist-and-aside">
        {/* <PostListView /> */}
        {/* <AsideSection /> */}
      </div>
    </main>
  );
}

function AsideSection() {
  return (
    <aside>
      <AuthorToFollow />
      <hr />
      <MorePosts />
    </aside>
  );
}

function MorePosts() {
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

        const authorQuery = firestore.doc(`/users/${data.authorId}`);
        const authorData = (await authorQuery.get()).data();

        const postData = {
          id: doc.id,
          ...data,
          ...metadataData,
          author: authorData,
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

      const authorQuery = firestore.doc(`/users/${data.authorId}`);
      const authorData = (await authorQuery.get()).data();

      const postData = {
        id: doc.id,
        ...data,
        ...metadataData,
        author: authorData,
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
    <section className="aside-posts">
      {posts &&
        posts.map((post, key) => <AsidePostCard key={key} post={post} />)}

      {posts.length !== 0 && !loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      {loading && <div>Loading...</div>}

      {postsEnd && "You have reached the end!"}
    </section>
  );
}

function AsidePostCard({ post }) {
  return (
    <div className="aside-post-card">
      <img className="cover-img" src={`${post.coverImgURL}`} />
      <div className="author-info">
        <img src={`${post.author.photoURL}`} alt={`${post.author.username}`} />
        <div className="username">{post.author.username}</div>
      </div>
      <div className="title">{post.title}</div>
      <div className="other-info">
        <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
        <span className="space">-</span>
        <span className="views">
          <ShowSVG /> {post.views}views
        </span>
        <span className="space">-</span>
        <div className="read-time">{post.readTime}min read</div>
      </div>
    </div>
  );
}

function AuthorToFollow() {
  // Currently the way author info is fetched, there are same authors
  // appearing (since they are retrived on the basis of trending posts
  // and 1 author may have many posts that are trending, so this leads
  // to displaying same author multiple times)

  const [trendingPosts, setTrendingPosts] = useState(null);
  const [followings, setFollowings] = useState(null);
  const { user, username } = useUserData();

  const getFollowings = async () => {
    if (user && username) {
      const query = firestore.collection(`/users/${user.uid}/followings`);
      const followings = (await query.get()).docs.map((doc) => {
        return {
          authorId: doc.id,
          data: doc.data(),
        };
      });
      setFollowings(followings);
    }
  };

  const checkFollowing = (authorId: string) => {
    if (followings) {
      const result = followings.filter(
        (author) => author.authorId === authorId
      );
      if (result.length > 0) return true;
    }
    return false;
  };

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
        authorId: authorDoc.id,
      });
    }

    setTrendingPosts(posts);
  };

  useEffect(() => {
    getTrendingPosts(5);
  }, []);

  useEffect(() => {
    getFollowings();
  }, [user, username]);

  const follow = async (authorId: string, authorName: string) => {
    if (user && username) {
      const ref = firestore.doc(`/users/${user.uid}/followings/${authorId}`);
      if ((await ref.get()).exists) {
        // unfollow
        await ref.delete();
        setFollowings((f) =>
          f.filter((author) => author.authorId !== authorId)
        );
      } else {
        // follow
        await ref.set({ authorName });
        setFollowings((f) => [...f, { authorId, data: { authorName } }]);
      }
    } else {
      // redirect to login OR sign up page
    }
  };

  return (
    <div className="authors-to-follow">
      <div className="heading">Authors to follow</div>
      {trendingPosts &&
        trendingPosts.map((post, key: number) => (
          <div key={key} className="author-card">
            <img
              src={`${post.author.photoURL}`}
              alt={`${post.author.username}`}
            />

            <div className="info">
              <div className="username">{post.author.username}</div>
              {post.author.status && (
                <div className="status">{post.author.status}</div>
              )}
              <button
                className={`follow-btn follow${
                  checkFollowing(post.authorId) ? "ing" : ""
                }`}
                onClick={() => follow(post.authorId, post.author.username)}
              >
                {checkFollowing(post.authorId) ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        ))}
    </div>
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
      <BigPostCard hook={useMostHeartedPostDataOnce} />

      <aside className="aside">
        <ExploreTags />

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

export default Index;
