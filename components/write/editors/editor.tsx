import { ChangeEventHandler } from "react";
import ReactMarkdown from "react-markdown";

import EditorMode0 from "./editor_mode_0";
import EditorMode2 from "./editor_mode_2";

interface Props {
  editorMode: number;
  content: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}

function Editor({ editorMode, content, handleChange }: Props) {
  if (editorMode === 0)
    return <EditorMode0 handleChange={handleChange} content={content} />;

  if (editorMode === 1)
    return <ReactMarkdown className="editor-mode-1">{content}</ReactMarkdown>;

  return <EditorMode2 content={content} handleChange={handleChange} />;
}

export default Editor;
