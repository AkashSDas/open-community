import { useRouter } from "next/router";

import { convertSecToJsxTime } from "../../lib/utils";

interface Props {
  hook(): {
    data: any;
    loading: boolean;
    error: any;
  };
}

function BigPostCard({ hook }: Props) {
  const router = useRouter();
  const { data, loading, error } = hook();

  if (loading || error || data === null) return <div>Loading...</div>;

  const { post, metadata, author } = data;

  return (
    <div
      className="big-post-card"
      onClick={() => router.push(`/posts/${data.id}`)}
    >
      <PostCoverImage
        url={post.coverImgURL}
        alt={post.title}
        readTime={metadata.readTime}
      />

      <div className="info">
        <h4>{post.title}</h4>
        <div className="description">{post.description}</div>
        <div className="metadata">
          <ProfilePic1 url={author.photoURL} alt={author.username} />

          <div>
            <div>{author.username}</div>
            <div>
              <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
              <span className="space">-</span>
              <span>{metadata.views} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProfilePic1Props {
  url: string;
  alt: string;
}

function ProfilePic1({ url, alt }: ProfilePic1Props) {
  return <img src={`${url}`} alt={`${alt}`} className="profile-pic-1" />;
}

interface PostCoverImageProps {
  url: string;
  alt: string;
  readTime: number;
}

function PostCoverImage({ url, alt, readTime }: PostCoverImageProps) {
  return (
    <div className="cover-img-with-read-time">
      <img src={`${url}`} alt={`${alt}`} />
      <div className="read-time">{readTime}min read</div>
    </div>
  );
}

export default BigPostCard;
