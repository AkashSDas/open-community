import { Formik } from "formik";
import { useRouter, withRouter } from "next/router";
import React, { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import PostForm from "../../components/write/post_form";
import { firestore, serverTimestamp } from "../../lib/firebase";
import { IPost, IPostMetadataThatAuthorCanSet } from "../write";

function EditPost() {
  return <WriteManager />;
}

function WriteManager() {
  const router = useRouter();
  const [postState, setPostState] = useState({
    post: null,
    metadata: null,
    content: null,
  });

  (async () => {
    if (router.query?.postId) {
      const postDocRef = firestore.doc(`posts/${router.query.postId}`);
      const post = await postDocRef.get();
      const postData = post.data();

      const metadataDocRef = firestore.doc(
        `postMetadata/${postData.metadataId}`
      );
      const metadata = await metadataDocRef.get();

      const postContentRef = firestore.doc(
        `postContents/${postData.postContentId}`
      );
      const postContent = await postContentRef.get();

      setPostState({
        post: post,
        metadata: metadata,
        content: postContent,
      });
    }
  })();

  if (
    postState.content !== null &&
    postState.metadata !== null &&
    postState.post !== null
  ) {
    return <PostEditForm postState={postState} />;
  }

  return <main>Loading...</main>;
}

function PostEditForm({ postState: { metadata, post, content } }) {
  const metadataData = metadata.data();
  const contentData = content.data();
  const postData = post.data();

  const [tags, setTags] = useState<string[]>(metadataData.tags);
  const [publish, setPublish] = useState(postData.publish);
  const [postMetadata, setPostMetadata] =
    useState<IPostMetadataThatAuthorCanSet>({
      readTime: metadataData.readTime,
      numOfWords: metadataData.wordCount,
    });

  const onSubmit = async (values: IPost) => {
    const batch = firestore.batch();

    const postRef = firestore.doc(`posts/${post.id}`);
    const metadataRef = firestore.doc(`postMetadata/${metadata.id}`);
    const contentRef = firestore.doc(`postContents/${content.id}`);

    batch.update(postRef, {
      coverImgURL: values.coverImageURL,
      title: values.title,
      description: values.description,
      publish,
    });

    batch.update(metadataRef, {
      lastmodifiedAt: serverTimestamp(),
      numOfWords: postMetadata.numOfWords,
      readTime: postMetadata.readTime,
      tags,
    });

    batch.update(contentRef, {
      content: values.content,
    });

    await batch.commit();
  };

  const initialFormValues: IPost = {
    title: postData.title,
    description: postData.description,
    coverImageURL: postData.coverImgURL,
    content: contentData.content,
  };

  return (
    <main>
      <section className="write-section">
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

export default EditPost;
