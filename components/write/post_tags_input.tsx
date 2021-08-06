import { Formik } from "formik";

import MultiplySVG from "../svg_icons/multiply";
import PlusSVG from "../svg_icons/plus";

interface Props {
  tags: string[];
  setTags: Function;
}

function PostTagsInput({ tags, setTags }: Props) {
  const onSubmit = (e) => {
    e.preventDefault();
  };

  const addTag = (tag: string, resetForm: Function) => {
    setTags([...tags, tag]);
    resetForm();
  };

  const displayTag = (tag: string, key: number) => (
    <span className="tag" key={key}>
      {tag}
      <button
        type="button"
        onClick={() => {
          setTags(tags.filter((tagText) => tagText !== tag));
        }}
      >
        <MultiplySVG />
      </button>
    </span>
  );

  // NOTE: add check for tag not being more than a certain length
  return (
    <Formik onSubmit={onSubmit} initialValues={{ tagText: "" }}>
      {({ values, handleChange, resetForm }) => (
        <div className="tags-input">
          <label>Enter tag</label>
          <div className="input">
            <input
              type="text"
              name="tagText"
              value={values.tagText}
              onChange={handleChange}
              placeholder="Tag name that suits your post"
            />
            <button
              type="button"
              className="add-btn"
              onClick={() => addTag(values.tagText, resetForm)}
            >
              <PlusSVG />
            </button>
          </div>
          <div className="display-tags">
            {tags.map((tag, key) => displayTag(tag, key))}
          </div>
        </div>
      )}
    </Formik>
  );
}

export default PostTagsInput;
