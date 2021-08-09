import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import { firestore } from "../../lib/firebase";
import { useFollowingAuthors } from "../../lib/hooks/followings";

function AuthorsToFollow() {
  // Get author to follow by getting users from users collection
  // later this can be customized to get more better results
  // like: authors whose most are getting more views in less time
  // in last week or something like that

  // recommendation to follow these authors
  const usersQuery = firestore.collection("/users").limit(6);
  const [authors, loading, error] = useCollectionDataOnce(usersQuery, {
    idField: "id",
  });

  // authors that user if already following
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

  if (loading || error || !authors) return <div>Loading...</div>;

  return (
    <section className="authors-to-follow">
      <div className="heading">Authors to follow</div>

      {authors.map((author, key: number) => (
        <div key={key} className="follow-author-card">
          <img src={`${author.photoURL}`} alt={`${author.username}`} />

          <div className="info">
            <div className="name">{author.username}</div>
            <div className="status">{author.status}</div>

            <button
              onClick={async () => {
                await followAction(author.id, author.username);
              }}
              className={`follow-btn follow${
                checkFollowing(author.id) ? "ing" : ""
              }`}
            >
              {checkFollowing(author.id) ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default AuthorsToFollow;
