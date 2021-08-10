import { useRouter } from "next/router";

import { convertSecToJsxTime } from "../../lib/utils";
import SizedBox from "../common/sized_box";

interface Props {
  post: {
    id: string;
    coverImgURL: string;
    title: string;
    description: string;
    lastmodifiedAt: number;
    views: number;
    readTime: number;
  };
}

function PostCard({ post }: Props) {
  const router = useRouter();

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
    <div className="post-card" onClick={() => router.push(`/posts/${post.id}`)}>
      {coverImgJsx()}
      {infoJsx()}
    </div>
  );
}

export default PostCard;
