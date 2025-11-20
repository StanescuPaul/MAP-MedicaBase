import styles from "./KInput.module.css";

export function KInput({ placeholder, type, value, onChange }) {
  return (
    <input
      className={styles.kinputStyle}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
