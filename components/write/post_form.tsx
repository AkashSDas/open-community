import { useEffect, useRef } from "react";
import { useState } from "react";
import { ChangeEventHandler, FormEventHandler } from "react";
import ReactMarkdown from "react-markdown";
import { useResizeTextareaHeight } from "../../lib/hooks";
import { IPost, IPostMetadataThatAuthorCanSet } from "../../pages/write";
import CameraSVG from "../svg_icons/camera";
import DocumentSVG from "../svg_icons/document";
import EditSquareSVG from "../svg_icons/edit_square";
import FilterSVG from "../svg_icons/fliter";
import ShowSVG from "../svg_icons/show";
import ImageInput from "./image_input";
import PostTagsInput from "./post_tags_input";

import { useScrollPosition } from "react-use-scroll-position";
import ChartSVG from "../svg_icons/chart";

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

function ContentEditor({
  content,
  handleChange,
}: {
  content: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}) {
  /// 0 - editor
  /// 1 - display markdown
  /// 2 - display both side by side
  const [editorMode, setEditorMode] = useState(0);

  const updateEditorMode = (mode: number) => setEditorMode(mode);

  const actionBtnsJsx = () => (
    <div className="action-btns">
      <button
        className={`show-btn ${editorMode === 0 ? "active" : "inactive"}`}
        onClick={() => updateEditorMode(0)}
      >
        <EditSquareSVG />
      </button>
      <button
        className={`edit-btn ${editorMode === 1 ? "active" : "inactive"}`}
        onClick={() => updateEditorMode(1)}
      >
        <ShowSVG />
      </button>
      <button
        className={`full-mode-btn ${editorMode === 2 ? "active" : "inactive"}`}
        onClick={() => updateEditorMode(2)}
      >
        <FilterSVG />
      </button>
    </div>
  );

  return (
    <div className="content-editor">
      <ContentEditorHeader
        editorMode={editorMode}
        actionBtnsJsx={actionBtnsJsx}
      />
      <Editor
        editorMode={editorMode}
        content={content}
        handleChange={handleChange}
      />
    </div>
  );
}

function ContentEditorHeader({ editorMode, actionBtnsJsx }) {
  const { y } = useScrollPosition();

  return (
    <div
      className={`header ${editorMode === 2 ? "full-mode-header" : ""} ${
        y >= 450 ? "raise-header" : ""
      }`}
    >
      <label>Content</label>
      {actionBtnsJsx()}
    </div>
  );
}

function Editor({
  editorMode,
  content,
  handleChange,
}: {
  editorMode: number;
  content: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}) {
  if (editorMode === 0) {
    return <EditorMode0 handleChange={handleChange} content={content} />;
  }

  if (editorMode === 1) {
    return <ReactMarkdown className="editor-mode-1">{content}</ReactMarkdown>;
  }

  return <EditorMode2 content={content} handleChange={handleChange} />;
}

function EditorMode0({ content, handleChange }) {
  const { ref } = useResizeTextareaHeight(content, true);

  return (
    <section className="editor-mode-0">
      <textarea
        ref={ref}
        className="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content"
      />
    </section>
  );
}

function EditorMode2({ content, handleChange }) {
  const { ref } = useResizeTextareaHeight(content);

  return (
    <section className="full-mode-editor">
      <textarea
        ref={ref}
        className="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content"
      />

      <ReactMarkdown className="preview">{content}</ReactMarkdown>
    </section>
  );
}

export default PostForm;
