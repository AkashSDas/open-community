import { ChangeEventHandler } from "react";

import { useResizeTextareaHeight } from "../../lib/hooks/resize_textarea_height";

interface Props {
  value: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}

function DescriptionTextarea({ value, handleChange }: Props) {
  const { ref } = useResizeTextareaHeight(value);

  return (
    <textarea
      ref={ref}
      className="description"
      name="description"
      value={value}
      onChange={handleChange}
      placeholder="Description"
      onKeyPress={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}

export default DescriptionTextarea;
