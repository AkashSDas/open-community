import { ChangeEventHandler, useState } from "react";

import EditSquareSVG from "../../svg_icons/edit_square";
import FilterSVG from "../../svg_icons/fliter";
import ShowSVG from "../../svg_icons/show";
import ContentEditorHeader from "./content_editor_header";
import Editor from "./editor";
import EditorChangeModeButton from "./editor_change_mode_button";

interface Props {
  content: string;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
}

function ContentEditor({ content, handleChange }: Props) {
  /// 0 - editor
  /// 1 - display markdown
  /// 2 - display both side by side
  const [editorMode, setEditorMode] = useState(0);

  const updateEditorMode = (mode: number) => setEditorMode(mode);

  const actionBtnsJsx = () => (
    <div className="action-btns">
      <EditorChangeModeButton
        updateEditorMode={updateEditorMode}
        currentMode={editorMode}
        mode={0}
        icon={<EditSquareSVG />}
        className="show-btn"
      />
      <EditorChangeModeButton
        updateEditorMode={updateEditorMode}
        currentMode={editorMode}
        mode={1}
        icon={<ShowSVG />}
        className="edit-btn"
      />
      <EditorChangeModeButton
        updateEditorMode={updateEditorMode}
        currentMode={editorMode}
        mode={2}
        icon={<FilterSVG />}
        className="full-mode-btn"
      />
    </div>
  );

  return (
    <div className="content-editor">
      <ContentEditorHeader
        editorMode={editorMode}
        actionBtnsJsx={actionBtnsJsx}
      />
      <Editor
        editorMode={editorMode}
        content={content}
        handleChange={handleChange}
      />
    </div>
  );
}

export default ContentEditor;
