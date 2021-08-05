import { Formik } from "formik";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import AdminPostCard from "../components/post_cards/admin_post_card";
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
  const [redirect, setRedirect] = useState({
    doRedirect: false,
    postDocId: null,
  });
  const router = useRouter();

  const performRedirect = () => {
    if (redirect.doRedirect) {
      router.push({
        pathname: `/edit/${redirect.postDocId}`,
      });
    }
  };

  const onSubmit = async (values) => {
    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    const authorId = auth.currentUser.uid;

    const metadataDoc = firestore.collection("postMetadata").doc();
    const metadataData = {
      hearts: 0,
      numOfWords: 0,
      readTime: 0,
      tags: [],
      views: 0,
    };
    batch.set(metadataDoc, metadataData);

    const postContentDoc = firestore.collection("postContents").doc();
    const postContentData = {
      content: "",
    };
    batch.set(postContentDoc, postContentData);

    const postDoc = firestore.collection("posts").doc();
    const postData = {
      authorId,
      coverImgURL: "",
      title: values.title,
      description: "",
      metadataId: metadataDoc.id,
      postContentId: postContentDoc.id,
      publish: false,
      createdAt: serverTimestamp(),
      lastmodifiedAt: serverTimestamp(),
    };
    batch.set(postDoc, postData);

    await batch.commit();

    setRedirect({
      doRedirect: true,
      postDocId: postDoc.id,
    });
  };

  const initialFormValues: { title: string } = {
    title: "",
  };

  return (
    <main>
      <section className="write-section">
        <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
          {({ values, handleChange, handleSubmit }) => (
            <form className="form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="Enter title for your post"
              />

              <button
                className="btn"
                type="submit"
                disabled={!(values.title?.length > 0)}
              >
                Choose
              </button>
            </form>
          )}
        </Formik>
        {performRedirect()}
      </section>

      <AdminPostCard />
    </main>
  );
}

export default Write;
