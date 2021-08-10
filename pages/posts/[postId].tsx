import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import SizedBox from "../../components/common/sized_box";
import SavedSVG from "../../components/svg_icons/saved";
import { firestore } from "../../lib/firebase";
import { useBookmark } from "../../lib/hooks/bookmark";
import { useFollowingAuthors } from "../../lib/hooks/followings";
import { convertSecToJsxTime } from "../../lib/utils";

export interface IPostState {
  id: string;
  post: any;
  metadata: any;
  content: any;
  author: any;
}

function PostContent() {
  const router = useRouter();

  const [postState, setPostState] = useState<IPostState>({
    post: null,
    metadata: null,
    content: null,
    author: null,
    id: null,
  });

  const {
    followings,
    loading: followingsLoading,
    error: followingsError,
    followAction,
  } = useFollowingAuthors();

  (async () => {
    // getting all post data from postId in router query
    if (router.query?.postId) {
      const postDocRef = firestore.doc(`posts/${router.query.postId}`);
      const post = await postDocRef.get();
      const postData = post.data();

      const metadataDocRef = firestore.doc(`postMetadata/${postDocRef.id}`);
      const metadata = await metadataDocRef.get();

      const postContentRef = firestore.doc(`postContents/${postDocRef.id}`);
      const postContent = await postContentRef.get();

      const authorQuery = firestore.doc(`/users/${postData.authorId}`);
      const author = await authorQuery.get();

      setPostState({
        id: post.id,
        post: post.data(),
        metadata: metadata.data(),
        content: postContent.data(),
        author: author.data(),
      });
    }
  })();

  const checkFollowing = (authorId: string) => {
    if (followings && !followingsLoading && !followingsError) {
      if (followings.find((author) => author.id === authorId)) {
        return true;
      }
    }
    return false;
  };

  const {
    bookmark,
    loading: bookmarkLoading,
    error: bookmarkError,
    bookmarkAction,
  } = useBookmark();

  const checkBookmarked = (postId: string) => {
    if (bookmark.length !== 0 && !bookmarkLoading && !bookmarkError) {
      if (bookmark.find((b) => b.id === postId)) {
        return true;
      }
    }
    return false;
  };

  if (
    postState.content !== null &&
    postState.metadata !== null &&
    postState.post !== null
  ) {
    return (
      <PostContentViewSection
        checkBookmarked={checkBookmarked}
        bookmarkAction={bookmarkAction}
        checkFollowing={checkFollowing}
        followAction={followAction}
        postState={postState}
      />
    );
  }

  return <main>Loading...</main>;
}

function PostContentViewSection({
  postState,
  checkFollowing,
  followAction,
  checkBookmarked,
  bookmarkAction,
}: {
  postState: IPostState;
  checkFollowing: Function;
  followAction: Function;
  checkBookmarked: Function;
  bookmarkAction: Function;
}) {
  const { id, post, metadata, content, author } = postState;

  return (
    <main className="post-content-view">
      <h2>{post.title}</h2>
      <div className="description">{post.description}</div>

      <div className="info">
        <div className="metadata">
          <span>
            {convertSecToJsxTime(post.lastmodifiedAt.toMillis() || 0)}
          </span>
          <SizedBox width="0.5rem" />
          <span>-</span>
          <SizedBox width="0.5rem" />
          <span>{metadata.views} views</span>
          <SizedBox width="0.5rem" />
          <span>-</span>
          <SizedBox width="0.5rem" />
          <span>{metadata.readTime}min read</span>
        </div>

        <button
          className={`${checkBookmarked(id) ? "marked" : ""}`}
          onClick={async () => await bookmarkAction(id, post.authorId)}
        >
          <SavedSVG />
        </button>
      </div>

      <div className="tags">
        {metadata.tags.map((tag, key: number) => (
          <span key={key}>#{tag}</span>
        ))}
      </div>

      <div className="author">
        <img src={`${author.photoURL}`} alt={`${author.username}`} />
        <div>
          <div className="name">{author.username}</div>
          <div className="status">{author.status}</div>
        </div>
        <button
          className={`follow-btn follow${
            checkFollowing(post.authorId) ? "ing" : ""
          }`}
          onClick={() => followAction(post.authorId, author.username)}
        >
          {checkFollowing(post.authorId) ? "Following" : "Follow"}
        </button>
      </div>

      <img
        className="cover-img"
        src={`${post.coverImgURL}`}
        alt={`${post.title}`}
      />

      <ReactMarkdown className="content-preview">
        {content.content}
      </ReactMarkdown>
    </main>
  );
}

export default PostContent;
