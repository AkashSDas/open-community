interface Props {
  currentMode: number;
  mode: number; // this btn's mode
  updateEditorMode(mode: number): void;
  icon: JSX.Element;
  className: string;
}

function EditorChangeModeButton(props: Props) {
  const { currentMode, mode, updateEditorMode, icon, className } = props;

  return (
    <button
      className={`${className} ${currentMode === mode ? "active" : "inactive"}`}
      onClick={() => updateEditorMode(mode)}
    >
      {icon}
    </button>
  );
}

export default EditorChangeModeButton;
