import styles from "./KButton.module.css";

export function KButton({ name, onClick }) {
  return (
    <button onClick={onClick} className={styles.kbuttonStyle}>
      {name}
    </button>
  );
}
