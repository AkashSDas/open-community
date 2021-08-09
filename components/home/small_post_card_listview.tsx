import { usePostDataOnce } from "../../lib/hooks/posts/posts";
import SizedBox from "../common/sized_box";
import SmallPostCard from "../post_cards/small_post_card";

function SmallPostCardtListView() {
  const LIMIT = 2;
  const { data, loading, error, postEnds, getData } = usePostDataOnce(LIMIT);

  return (
    <section className="small-posts-listview">
      {data.map((d, key: number) => (
        <>
          <SmallPostCard
            key={key}
            post={{
              coverImgURL: d.post.coverImgURL,
              title: d.post.title,
              description: d.post.description,
              lastmodifiedAt: d.post.lastmodifiedAt,
              views: d.metadata.views,
              readTime: d.metadata.readTime,
            }}
          />
          <SizedBox height="1rem" />
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

export default SmallPostCardtListView;
