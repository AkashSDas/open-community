import { Formik } from "formik";
import { useState } from "react";

import { serverTimestamp } from "../../lib/firebase";
import { updatePost } from "../../lib/posts";
import { IPostState } from "../../pages/edit/[postId]";
import PostForm, { IPostFormValues } from "../write/post_form";

function PostEditForm({ postState }: { postState: IPostState }) {
  const { post, metadata, content } = postState;

  // Getting the data to fill
  const postData = post.data();
  const contentData = content.data();
  const metadataData = metadata.data();

  // NOTE: later merge states of tags and postMetadata
  const [publish, setPublish] = useState(postData.publish);
  const [tags, setTags] = useState<string[]>(metadataData.tags);
  const [postMetadata, setPostMetadata] = useState<{
    readTime: number;
    numOfWords: number;
  }>({
    readTime: metadataData.readTime,
    numOfWords: metadataData.wordCount,
  });

  const onSubmit = async (values: IPostFormValues) => {
    await updatePost({
      postId: post.id,
      metadataId: metadata.id,
      contentId: content.id,
      post: {
        title: values.title,
        description: values.description,
        coverImgURL: values.coverImageURL,
        publish,
        lastmodifiedAt: serverTimestamp(),
      },
      metadata: {
        numOfWords: postMetadata.numOfWords,
        readTime: postMetadata.readTime,
        tags,
      },
      content: {
        content: values.content,
      },
    });
  };

  const initialFormValues: IPostFormValues = {
    title: postData.title,
    description: postData.description,
    coverImageURL: postData.coverImgURL,
    content: contentData.content,
  };

  return (
    <main>
      <section className="edit-section">
        <Formik onSubmit={onSubmit} initialValues={initialFormValues}>
          {({ values, handleSubmit, handleChange }) => (
            <PostForm
              values={values}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              tags={tags}
              setTags={setTags}
              publish={publish}
              setPublish={setPublish}
              postMetadata={postMetadata}
              setPostMetadata={setPostMetadata}
            />
          )}
        </Formik>
      </section>
    </main>
  );
}
export default PostEditForm;
