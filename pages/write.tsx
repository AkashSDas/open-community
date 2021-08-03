import { Formik } from "formik";
import { useState } from "react";
import PostForm from "../components/write/post_form";

export interface IPost {
  title: string;
  description: string;
  coverImageURL: string;
  content: string;
}

function Write() {
  const [tags, setTags] = useState<string[]>([]);

  const onSubmit = () => {};
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
            />
          )}
        </Formik>
      </section>
    </main>
  );
}

export default Write;
