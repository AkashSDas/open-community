import { useEffect, useState } from "react";

import Greeting from "../components/common/greeting";
import BigPostWithMostHeartsCard from "../components/home/big_post_with_most_hearts_card";
import LogoSVG from "../components/svg_icons/logo";
import ShowSVG from "../components/svg_icons/show";
import { firestore } from "../lib/firebase";

function Index() {
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
    <main className="home">
      <Greeting />
      <HomePageTopSection />
      <hr />
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
                  <div className="description">{post.post.description}</div>
                  <div className="metadata">
                    {convertSecToJsxTime(post.post.lastmodifiedAt)} -{" "}
                    <ShowSVG /> {post.metadata.views} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
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
