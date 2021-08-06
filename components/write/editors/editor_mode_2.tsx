import { ChangeEventHandler } from "react";
import ReactMarkdown from "react-markdown";

import { useResizeTextareaHeight } from "../../../lib/hooks";

interface Props {
  content: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}

function EditorMode2({ content, handleChange }: Props) {
  const { ref } = useResizeTextareaHeight(content);

  return (
    <section className="full-mode-editor">
      <textarea
        ref={ref}
        className="content"
        name="content"
        value={content}
        onChange={handleChange}
        placeholder="Start writing your content"
      />

      <ReactMarkdown className="preview">{content}</ReactMarkdown>
    </section>
  );
}

export default EditorMode2;
