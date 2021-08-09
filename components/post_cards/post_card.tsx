import { convertSecToJsxTime } from "../../lib/utils";
import SizedBox from "../common/sized_box";

interface Props {
  post: {
    coverImgURL: string;
    title: string;
    description: string;
    lastmodifiedAt: number;
    views: number;
    readTime: number;
  };
}

function PostCard({ post }: Props) {
  const coverImgJsx = () => (
    <div className="cover">
      <img src={`${post.coverImgURL}`} alt={`${post.title}`} />
      <div className="read-time">{post.readTime}min read</div>
    </div>
  );

  const infoJsx = () => (
    <div className="info">
      <h4>{post.title}</h4>
      <div className="description">{post.description}</div>
      <div className="metadata">
        <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
        <SizedBox width="0.5rem" />
        <span>-</span>
        <SizedBox width="0.5rem" />
        <span>{post.views} views</span>
      </div>
    </div>
  );

  return (
    <div className="post-card">
      {coverImgJsx()}
      {infoJsx()}
    </div>
  );
}

export default PostCard;
