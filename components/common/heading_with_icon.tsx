import styles from "../../styles/scss/components/heading_with_icon.module.scss";

interface Props {
  icon: JSX.Element;
  text: string;
}

function HeadingWithIcon(props: Props) {
  return (
    <div className={styles["heading-with-icon"]}>
      <span className={styles["icon"]}>{props.icon}</span>
      <h4 className={styles["text"]}>{props.text}</h4>
    </div>
  );
}

export default HeadingWithIcon;
