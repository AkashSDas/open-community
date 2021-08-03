import { useState } from "react";
import { Formik } from "formik";
import MultiplySVG from "../svg_icons/multiply";
import PlusSVG from "../svg_icons/plus";

function PostTagsInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: Function;
}) {
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
