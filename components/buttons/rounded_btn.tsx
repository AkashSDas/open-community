import { MouseEventHandler } from "react";

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function RoundedButton(props: Props) {
  return (
    <button className="rounded-btn" onClick={props.onClick}>
      {props.text}
    </button>
  );
}

export default RoundedButton;
