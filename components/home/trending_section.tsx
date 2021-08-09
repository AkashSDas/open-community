import { useTrendingPostDataOnce } from "../../lib/hooks/posts/trending_post";
import TrendingPostCard from "../post_cards/trending_post_card";

function TrendingSection() {
  const { data: posts, loading, error } = useTrendingPostDataOnce(6);

  if (loading || error || posts === null) return <div>Loading...</div>;

  return (
    <section className="trending">
      <h4>Trending on Open Community</h4>

      <div className="posts">
        {posts.map((post, key: number) => (
          <TrendingPostCard
            rank={`0${key + 1}`}
            author={{
              photoURL: post.author.photoURL,
              name: post.author.username,
            }}
            post={{
              title: post.post.title,
              views: post.metadata.views,
              lastmodifiedAt: post.post.lastmodifiedAt,
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default TrendingSection;
