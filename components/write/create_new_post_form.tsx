import { Formik, FormikHelpers } from "formik";
import { FormEventHandler } from "react";
import { INewPost } from "../../lib/posts/interfaces";

interface Props {
  initialFormValues: INewPost;
  onSubmit: ((
    values: INewPost,
    formikHelpers: FormikHelpers<INewPost>
  ) => void | Promise<any>) &
    FormEventHandler<HTMLFormElement>;
}

function CreateNewPostForm(props: Props) {
  const { initialFormValues, onSubmit } = props;

  return (
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
  );
}

export default CreateNewPostForm;
