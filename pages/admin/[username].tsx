import { useRouter } from "next/router";

import Divider from "../../components/common/divider";
import SizedBox from "../../components/common/sized_box";
import AuthorsToFollow from "../../components/home/authors_to_follow";
import SmallPostCardtListView from "../../components/home/small_post_card_listview";
import PostCard from "../../components/post_cards/post_card";
import SmallPostCard from "../../components/post_cards/small_post_card";
import { useFollowingAuthors } from "../../lib/hooks/followings";
import { useAuthorPostsDataOnce } from "../../lib/hooks/posts/author_posts";

function Admin() {
  const router = useRouter();
  const {
    data,
    pageLoading,
    loadMoreLoading,
    error,
    author,
    postEnds,
    getData,
  } = useAuthorPostsDataOnce(2);

  const {
    followings,
    loading: followingsLoading,
    error: followingsError,
    followAction,
  } = useFollowingAuthors();

  const checkFollowing = (authorId: string) => {
    if (followings && !followingsLoading && !followingsError) {
      if (followings.find((author) => author.id === authorId)) {
        return true;
      }
    }
    return false;
  };

  if (pageLoading || error) return <main>Loading...</main>;

  if (!author) return <main>Author doesn't exists</main>;

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
            {data.map((d, key: number) => (
              <>
                <PostCard
                  key={key}
                  post={{
                    id: d.id,
                    coverImgURL: d.post.coverImgURL,
                    title: d.post.title,
                    description: d.post.description,
                    lastmodifiedAt: d.post.lastmodifiedAt,
                    views: d.metadata.views,
                    readTime: d.metadata.readTime,
                  }}
                />
                <SizedBox height="2rem" />
              </>
            ))}

            {data.length !== 0 && !loadMoreLoading && !postEnds && (
              <button onClick={() => getData(true)}>Load more</button>
            )}

            {loadMoreLoading && "Loading..."}

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
