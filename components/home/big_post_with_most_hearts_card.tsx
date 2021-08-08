import { useMostHeartedPostDataOnce } from "../../lib/hooks/posts/most_hearted_post";
import { convertSecToJsxTime } from "../../lib/utils";
import ShowSVG from "../svg_icons/show";

function BigPostWithMostHeartsCard() {
  const { data, loading, error } = useMostHeartedPostDataOnce();

  if (loading || error || data === null) return <div>Loading...</div>;

  const { post, metadata, author } = data;

  return (
    <div className="big-post-card">
      <PostCoverImage
        url={post.coverImgURL}
        alt={post.title}
        readTime={metadata.readTime}
      />
    </div>
    // <div className="big-post">
    //   <div className="cover-img">
    //     <img src={post.coverImgURL} alt={post.title} />
    //     <div className="read-time">{metadata.readTime} min</div>
    //   </div>

    //   <div className="info">
    //     <h4>{post.title}</h4>
    //     <div className="description">{post.description}</div>
    //     <div className="author-info">
    //       <div className="img">
    //         <img src={author.photoURL} alt={author.username} />
    //       </div>
    //       <div className="info">
    //         <div className="author-name">{author.username}</div>
    //         <div className="post-info">
    //           <span>{convertSecToJsxTime(post.lastmodifiedAt)}</span>
    //           <span className="space">-</span>
    //           <span className="views">
    //             <ShowSVG /> {metadata.views} views
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
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

export default BigPostWithMostHeartsCard;
