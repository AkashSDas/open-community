import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Divider from "../../components/common/divider";
import SizedBox from "../../components/common/sized_box";
import AuthorsToFollow from "../../components/home/authors_to_follow";
import SmallPostCardtListView from "../../components/home/small_post_card_listview";
import PostCard from "../../components/post_cards/post_card";
import SmallPostCard from "../../components/post_cards/small_post_card";
import {
    firestore, FirestoreDocumentData, fromMillis, serializePostDocData
} from "../../lib/firebase";
import { useFollowingAuthors } from "../../lib/hooks/followings";
import { useAuthorPostsDataOnce } from "../../lib/hooks/posts/author_posts";
import { useAuthorMorePostsDataOnce } from "../../lib/hooks/posts/more_posts";

// Since the data for admin's or author's posts won't change that often
// so this is a good candidate for traditional server side rendering
// which will make it visible to SEO bots too

export const getServerSideProps: GetServerSideProps = async ({
  query,
}): Promise<any> => {
  const { username } = query;

  // get user doc
  const authorQuery = firestore
    .collection("users")
    .where("username", "==", username)
    .limit(1);
  const userDoc = (await authorQuery.get()).docs.map((doc) => {
    return { id: doc.id, data: doc.data() };
  });

  if (userDoc.length === 0) {
    return {
      notFound: true,
    };
  }

  const user = userDoc[0];
  const postQuery = firestore
    .collection("posts")
    .where("authorId", "==", user.id)
    .orderBy("lastmodifiedAt", "desc")
    .limit(2);
  const posts = (await postQuery.get()).docs.map((doc) => {
    return {
      id: doc.id,
      data: serializePostDocData(doc),
    };
  });

  let data = [];
  for await (const post of posts) {
    const metadataQuery = firestore.doc(`/postMetadata/${post.id}`);
    const metadataDoc = await metadataQuery.get();
    data.push({ post, metadata: metadataDoc.data() });
  }

  return {
    props: {
      user,
      data,
    },
  };
};

function Admin({ user: author, data }) {
  // get posts data on client side (every thing is taken care of by the
  // useAuthorPostDataOnce hook)
  // const {
  //   data,
  //   pageLoading,
  //   loadMoreLoading,
  //   error,
  //   author,
  //   postEnds,
  //   getData,
  // } = useAuthorPostsDataOnce(2);

  const {
    followings,
    loading: followingsLoading,
    error: followingsError,
    followAction,
  } = useFollowingAuthors();

  const {
    data: posts,
    loading,
    error,
    getData,
    postEnds,
  } = useAuthorMorePostsDataOnce(author.id, data, 2);

  const checkFollowing = (authorId: string) => {
    if (followings && !followingsLoading && !followingsError) {
      if (followings.find((author) => author.id === authorId)) {
        return true;
      }
    }
    return false;
  };

  return (
    <main className="admin">
      <section className="banner">
        <img
          src={`https://images.unsplash.com/photo-1623645481161-0d8160281cbf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=620&q=80`}
          alt={`${author.data.username}`}
        />
        <div className="mask"></div>
        <h1>{author.data.username}</h1>
        <div className="status">{author.data.status}</div>
      </section>

      <section className="author-info">
        <img src={`${author.data.photoURL}`} alt={`${author.data.username}`} />

        <div>
          <h4>{author.data.username}</h4>
          <div className="status">{author.data.status}</div>
        </div>

        <button
          className={`${checkFollowing(author.id) ? "following" : ""}`}
          onClick={() => followAction(author.id, author.data.username)}
        >
          {checkFollowing(author.id) ? "Following" : "Follow"}
        </button>
      </section>

      <div className="postlist-and-aside">
        <section className="postlist">
          <div className="heading">{author.data.username}'s posts</div>
          <SizedBox height="1rem" />
          <Divider />
          <SizedBox height="1rem" />

          <div className="posts-listview">
            {posts.map((d, key: number) => (
              <>
                <PostCard
                  key={key}
                  post={{
                    id: d.post.id,
                    coverImgURL: d.post.data.coverImgURL,
                    title: d.post.data.title,
                    description: d.post.data.description,
                    lastmodifiedAt: d.post.data.lastmodifiedAt,
                    views: d.metadata.views,
                    readTime: d.metadata.readTime,
                  }}
                />
                <SizedBox height="2rem" />
              </>
            ))}

            {posts.length !== 0 && !loading && !postEnds && (
              <button onClick={() => getData()}>Load more</button>
            )}

            {loading && "Loading..."}

            {postEnds && "You have reached the end!"}
          </div>
        </section>

        <aside>
          <AuthorsToFollow />
          <SizedBox height="2rem" />
          <Divider />
          <SizedBox height="2rem" />
          <SmallPostCardtListView />
        </aside>
      </div>
    </main>
  );
}

export default Admin;
