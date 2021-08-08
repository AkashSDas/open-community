import { ChangeEventHandler } from "react";

import { useResizeTextareaHeight } from "../../lib/hooks/resize_textarea_height";

interface Props {
  value: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}

function TitleTextarea({ value, handleChange }: Props) {
  const { ref } = useResizeTextareaHeight(value);

  return (
    <textarea
      ref={ref}
      className="title"
      name="title"
      value={value}
      onChange={handleChange}
      placeholder="Title"
      onKeyPress={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}

export default TitleTextarea;
