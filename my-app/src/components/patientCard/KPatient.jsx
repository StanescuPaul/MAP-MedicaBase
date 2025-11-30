import styles from "./KPatient.module.css";

export function KPatient({ name, cnp, number, onClick }) {
  return (
    <button onClick={onClick} className={styles.container}>
      <h1 className={styles.textStyle}>Patient {number}</h1>
      <div className={styles.textLable}>
        <p className={styles.subData}>name:</p>
        <p className={styles.dataStyle}>{name}</p>
      </div>
      <div className={styles.textLable1}>
        <p className={styles.subData}>CNP:</p>
        <p className={styles.dataStyle}>{cnp}</p>
      </div>
    </button>
  );
}
