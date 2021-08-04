import { Formik } from "formik";
import { FormEvent, useState } from "react";
import PostForm from "../components/write/post_form";
import { auth, firestore, serverTimestamp } from "../lib/firebase";

export interface IPost {
  title: string;
  description: string;
  coverImageURL: string;
  content: string;
}

export interface IPostMetadataThatAuthorCanSet {
  numOfWords: number;
  readTime: number;
}

function Write() {
  const [tags, setTags] = useState<string[]>([]);
  const [publish, setPublish] = useState(false);
  const [postMetadata, setPostMetadata] =
    useState<IPostMetadataThatAuthorCanSet>(null);

  const onSubmit = (values: IPost) => {
    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    const authorId = auth.currentUser.uid;

    const metadataDoc = firestore.collection("postMetadata").doc();
    const metadataData = {
      createdAt: serverTimestamp(),
      lastmodifiedAt: serverTimestamp(),
      hearts: 0,
      numOfWords: postMetadata.numOfWords,
      readTime: postMetadata.readTime,
      tags: tags,
      views: 0,
    };
    batch.set(metadataDoc, metadataData);

    const postContentDoc = firestore.collection("postContents").doc();
    const postContentData = {
      content: values.content,
    };
    batch.set(postContentDoc, postContentData);

    const postDoc = firestore.collection("posts").doc();
    const postData = {
      authorId,
      coverImgURL: values.coverImageURL,
      title: values.title,
      description: values.description,
      metadataId: metadataDoc.id,
      postContentId: postContentDoc.id,
    };
    batch.set(postDoc, postData);

    batch.commit();
  };

  const initialFormValues: IPost = {
    title: "",
    description: "",
    coverImageURL: "",
    content: "",
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

export default Write;
