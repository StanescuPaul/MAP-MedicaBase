import styles from "./KPatient.module.css";

export function KPatient({ name, cnp, createdAt, updatedAt }) {
  return (
    <button className={styles.container}>
      <div className={styles.textLable}>
        <p className={styles.subData}>nume:</p>
        <p className={styles.dataStyle}>{name}</p>
      </div>
      <div className={styles.textLable}>
        <p className={styles.subData}>CNP:</p>
        <p className={styles.dataStyle}>{cnp}</p>
      </div>
      {/* <div className={styles.textLable}>
        <p className={styles.subData}>Created:</p>
        <p className={styles.dataStyle}>{createdAt}</p>
      </div>
      <div className={styles.textLable}>
        <p className={styles.subData}>Updated:</p>
        <p className={styles.dataStyle}>{updatedAt}</p>
      </div> */}
    </button>
  );
}
