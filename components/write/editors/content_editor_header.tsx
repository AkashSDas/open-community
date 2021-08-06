import { useScrollPosition } from "react-use-scroll-position";

interface Props {
  editorMode: number;
  actionBtnsJsx(): JSX.Element;
}

function ContentEditorHeader({ editorMode, actionBtnsJsx }: Props) {
  const { y } = useScrollPosition();

  return (
    <div
      className={`header ${editorMode === 2 ? "full-mode-header" : ""} ${
        y >= 450 ? "raise-header" : ""
      }`}
    >
      <label>Content</label>
      {actionBtnsJsx()}
    </div>
  );
}

export default ContentEditorHeader;
