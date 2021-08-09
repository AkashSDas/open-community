import { convertSecToJsxTime } from "../../lib/utils";
import SizedBox from "../common/sized_box";

interface Props {
  rank: string;
  author: {
    photoURL: string;
    name: string;
  };
  post: {
    title: string;
    views: number;
    lastmodifiedAt: number;
  };
}

function TrendingPostCard({ rank, author, post }: Props) {
  const authorInfoJsx = () => (
    <div className="author">
      <img src={`${author.photoURL}`} alt={`${author.name}`} />
      <div className="name">{author.name}</div>
    </div>
  );

  const postInfoJsx = () => (
    <>
      <div className="title">{post.title}</div>
      <div className="metadata">
        <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
        <SizedBox width="0.5rem" />
        <span>-</span>
        <SizedBox width="0.5rem" />
        <span>{post.views} views</span>
      </div>
    </>
  );

  return (
    <div className="trending-post-card">
      <div className="rank">{rank}</div>
      <div className="info">
        {authorInfoJsx()}
        {postInfoJsx()}
      </div>
    </div>
  );
}

export default TrendingPostCard;
