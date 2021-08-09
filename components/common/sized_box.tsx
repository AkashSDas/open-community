interface Props {
  height?: string;
  width?: string;
}

function SizedBox(props: Props) {
  const style = {
    height: props.height,
    width: props.width,
  };

  return <div className="sized-box" style={style}></div>;
}

export default SizedBox;
