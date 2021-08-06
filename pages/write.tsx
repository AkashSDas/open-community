import { Formik } from "formik";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import AdminPostCard from "../components/post_cards/admin_post_card";
import { auth, firestore, serverTimestamp } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import { createNewPost } from "../lib/posts";

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
  const { user, username } = useUserData();

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
    const { postRef } = await createNewPost(values, user);

    setRedirect({
      doRedirect: true,
      postDocId: postRef.id,
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

      {user && username && <AdminPostCard />}
    </main>
  );
}

export default Write;
