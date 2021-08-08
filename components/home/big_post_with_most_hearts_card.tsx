import { useMostHeartedPostDataOnce } from "../../lib/hooks/posts/most_hearted_post";
import { convertSecToJsxTime } from "../../lib/utils";
import ShowSVG from "../svg_icons/show";

interface State {
  post: any;
  metadata: any;
  id: string;
  authorInfo: any;
}

function BigPostWithMostHeartsCard() {
  const { data, loading, error } = useMostHeartedPostDataOnce();

  if (loading || error || data === null) return <div>Loading...</div>;

  const { post, metadata, author } = data;

  return (
    <div className="big-post">
      <div className="cover-img">
        <img src={post.coverImgURL} alt={post.title} />
        <div className="read-time">{metadata.readTime} min</div>
      </div>

      <div className="info">
        <h4>{post.title}</h4>
        <div className="description">{post.description}</div>
        <div className="author-info">
          <div className="img">
            <img src={author.photoURL} alt={author.username} />
          </div>
          <div className="info">
            <div className="author-name">{author.username}</div>
            <div className="post-info">
              <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
              <span className="space">-</span>
              <span className="views">
                <ShowSVG /> {metadata.views} views
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BigPostWithMostHeartsCard;
