import { ChangeEventHandler, FormEventHandler, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useScrollPosition } from "react-use-scroll-position";

import { useResizeTextareaHeight } from "../../lib/hooks";
import { IPost, IPostMetadataThatAuthorCanSet } from "../../pages/write";
import CameraSVG from "../svg_icons/camera";
import DocumentSVG from "../svg_icons/document";
import ContentEditor from "./editors/content_editor";
import ImageInput from "./image_input";
import PostTagsInput from "./post_tags_input";

interface FormProps {
  values: IPost;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  //   handleChange: ChangeEventHandler<HTMLInputElement>;
  handleChange: ChangeEventHandler<any>;

  tags: string[];
  setTags: Function;

  publish: boolean;
  setPublish: Function;

  postMetadata: IPostMetadataThatAuthorCanSet;
  setPostMetadata: Function;
}

function TitleTextarea({ value, handleChange }) {
  const { ref } = useResizeTextareaHeight(value);

  return (
    <textarea
      ref={ref}
      className="title"
      name="title"
      value={value}
      onChange={handleChange}
      placeholder="Title"
      onKeyPress={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}

function DescriptionTextarea({ value, handleChange }) {
  const { ref } = useResizeTextareaHeight(value);

  return (
    <textarea
      ref={ref}
      className="description"
      name="description"
      value={value}
      onChange={handleChange}
      placeholder="Description"
      onKeyPress={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}

function PostForm({
  values,
  handleSubmit,
  handleChange,
  tags,
  setTags,
  publish,
  setPublish,
  postMetadata,
  setPostMetadata,
}: FormProps) {
  return (
    <form onSubmit={handleSubmit}>
      <TitleTextarea value={values.title} handleChange={handleChange} />
      <DescriptionTextarea
        value={values.description}
        handleChange={handleChange}
      />

      <PostTagsInput tags={tags} setTags={setTags} />
      <ImageInput
        coverImageURL={values.coverImageURL}
        handleChange={handleChange}
      />

      <UploadImage />

      <ContentEditor content={values.content} handleChange={handleChange} />

      <MetaData
        value={publish}
        content={values.content}
        setPublish={setPublish}
        postMetadata={postMetadata}
        setPostMetadata={setPostMetadata}
      />

      <button className="btn save-btn" type="submit">
        Save
      </button>
    </form>
  );
}

function MetaData({
  value,
  setPublish,
  content,
  postMetadata,
  setPostMetadata,
}) {
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

  const toggleCheckbox = () => {
    setPublish((publish) => !publish);
  };

  return (
    <div className="post-metadata">
      <div className="post-metadata-item">
        <input
          type="checkbox"
          name="publish"
          value={value}
          onChange={toggleCheckbox}
        />
        <div
          className="box"
          style={{
            backgroundColor: value ? "yellowgreen" : "var(--red)",
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

function UploadImage() {
  const [url, setURL] = useState(null);
  return (
    <div className="upload-img">
      <button className="icon-btn">
        <CameraSVG /> Upload image
      </button>

      {url ? <span className="link">{url}</span> : null}

      <span className="clipboard-icon">
        <DocumentSVG />
      </span>
    </div>
  );
}

export default PostForm;
