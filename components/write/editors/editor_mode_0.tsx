import { ChangeEventHandler } from "react";

import { useResizeTextareaHeight } from "../../../lib/hooks";

interface Props {
  content: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}

function EditorMode0({ content, handleChange }: Props) {
  const { ref } = useResizeTextareaHeight(content, true);

  return (
    <section className="editor-mode-0">
      <textarea
        ref={ref}
        className="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content"
      />
    </section>
  );
}

export default EditorMode0;
