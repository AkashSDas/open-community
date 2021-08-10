import { usePostDataOnce } from "../../lib/hooks/posts/posts";
import SizedBox from "../common/sized_box";
import PostCard from "../post_cards/post_card";

function PostListView() {
  const LIMIT = 2;
  const { data, loading, error, postEnds, getData } = usePostDataOnce(LIMIT);

  return (
    <section className="posts-listview">
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

      {data.length !== 0 && !loading && !postEnds && (
        <button onClick={() => getData(true)}>Load more</button>
      )}

      {loading && "Loading..."}

      {postEnds && "You have reached the end!"}
    </section>
  );
}

export default PostListView;
