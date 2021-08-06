import React, { ChangeEventHandler, FormEventHandler } from "react";

import DescriptionTextarea from "./description_textarea";
import ContentEditor from "./editors/content_editor";
import ImageInput from "./image_input";
import PostMetadata from "./post_metadata";
import PostTagsInput from "./post_tags_input";
import TitleTextarea from "./title_textarea";
import UploadImage from "./upload_image";

export interface IPostFormValues {
  title: string;
  description: string;
  coverImageURL: string;
  content: string;
}

export interface IPostMetadataFormValues {
  numOfWords: number;
  readTime: number;
}

export interface PostFormProps {
  values: IPostFormValues;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: ChangeEventHandler<any>;

  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  publish: boolean;
  setPublish: React.Dispatch<React.SetStateAction<boolean>>;
  postMetadata: IPostMetadataFormValues;
  setPostMetadata: React.Dispatch<
    React.SetStateAction<IPostMetadataFormValues>
  >;
}

function PostForm(props: PostFormProps) {
  let { values, handleSubmit, handleChange } = props;
  let { tags, setTags } = props;
  let { publish, setPublish } = props;
  let { postMetadata, setPostMetadata } = props;

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
      <PostMetadata
        publish={publish}
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

export default PostForm;
