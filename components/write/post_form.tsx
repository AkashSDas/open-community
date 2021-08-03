import { useState } from "react";
import { ChangeEventHandler, FormEventHandler } from "react";
import ReactMarkdown from "react-markdown";
import { useResizeTextareaHeight } from "../../lib/hooks";
import { IPost } from "../../pages/write";
import CameraSVG from "../svg_icons/camera";
import DocumentSVG from "../svg_icons/document";
import EditSquareSVG from "../svg_icons/edit_square";
import FilterSVG from "../svg_icons/fliter";
import ShowSVG from "../svg_icons/show";
import ImageInput from "./image_input";
import PostTagsInput from "./post_tags_input";

interface FormProps {
  values: IPost;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  //   handleChange: ChangeEventHandler<HTMLInputElement>;
  handleChange: ChangeEventHandler<any>;

  tags: string[];
  setTags: Function;
}

function PostForm({
  values,
  handleSubmit,
  handleChange,
  tags,
  setTags,
}: FormProps) {
  const { ref: titleTextareaRef } = useResizeTextareaHeight(values.title);
  const { ref: descriptionTextareaRef } = useResizeTextareaHeight(
    values.description
  );

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        ref={titleTextareaRef}
        className="title"
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        ref={descriptionTextareaRef}
        className="description"
        name="description"
        value={values.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <PostTagsInput tags={tags} setTags={setTags} />
      <ImageInput
        coverImageURL={values.coverImageURL}
        handleChange={handleChange}
      />

      <UploadImage />

      <ContentEditor content={values.content} handleChange={handleChange} />
    </form>
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
      <button onClick={() => updateEditorMode(0)}>
        <ShowSVG />
      </button>
      <button onClick={() => updateEditorMode(1)}>
        <EditSquareSVG />
      </button>
      <button onClick={() => updateEditorMode(2)}>
        <FilterSVG />
      </button>
    </div>
  );

  return (
    <div className="content">
      <div className="header">
        <label>Content</label>
        {actionBtnsJsx()}
      </div>
      <Editor
        editorMode={editorMode}
        content={content}
        handleChange={handleChange}
      />
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
  const { ref } = useResizeTextareaHeight(content);

  if (editorMode === 0) {
    return (
      <textarea
        ref={ref}
        className="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content"
      />
    );
  }

  if (editorMode === 1) {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  }

  return (
    <section>
      <textarea
        ref={ref}
        className="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content"
      />

      <div>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  );
}

export default PostForm;
