import React, { useEffect } from "react";

import DocumentSVG from "../svg_icons/document";

interface IPostMetadata {
  numOfWords: number;
  readTime: number;
}

interface Props {
  content: string;
  publish: boolean;
  setPublish: React.Dispatch<React.SetStateAction<boolean>>;
  postMetadata: IPostMetadata;
  setPostMetadata: React.Dispatch<React.SetStateAction<IPostMetadata>>;
}

function PostMetadata(props: Props) {
  let { content, publish, setPublish, postMetadata, setPostMetadata } = props;

  // Naive method to calc word count and read time
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/g).length;
    const minutesToRead = parseInt((wordCount / 100 + 1).toFixed(0));

    setPostMetadata({
      ...postMetadata,
      numOfWords: wordCount,
      readTime: minutesToRead,
    });
  }, [content]);

  const toggleCheckbox = () => setPublish((publish) => !publish);

  return (
    <div className="post-metadata">
      <div className="post-metadata-item">
        <input
          type="checkbox"
          name="publish"
          value={publish.toString()}
          onChange={toggleCheckbox}
        />
        <div
          className="box"
          style={{
            backgroundColor: publish ? "yellowgreen" : "var(--red)",
          }}
          onClick={toggleCheckbox}
        ></div>
        <label>Publish</label>
      </div>
      <div className="post-metadata-item">
        <DocumentSVG /> Read time - {postMetadata?.readTime}min
      </div>
      <div className="post-metadata-item rotate">
        <DocumentSVG /> Num of words - {postMetadata?.numOfWords}
      </div>
    </div>
  );
}

export default PostMetadata;
