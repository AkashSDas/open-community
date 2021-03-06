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

function SmallPostCard({ post }: Props) {
  const router = useRouter();

  const coverImgJsx = () => (
    <div className="cover">
      <img src={`${post.coverImgURL}`} alt={`${post.title}`} />
      <div className="read-time">{post.readTime}min read</div>
    </div>
  );

  const infoJsx = () => (
    <div className="info">
      <div className="heading">{post.title}</div>
      <div className="metadata">
        <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
        <SizedBox width="0.25rem" />
        <span>-</span>
        <SizedBox width="0.25rem" />
        <span>{post.views} views</span>
      </div>
    </div>
  );

  return (
    <div
      className="small-post-card"
      onClick={() => router.push(`/posts/${post.id}`)}
    >
      {coverImgJsx()}
      {infoJsx()}
    </div>
  );
}

export default SmallPostCard;
