import styles from "./KPatient.module.css";

export function KPatient({ name, cnp, createdAt, updatedAt, number }) {
  return (
    <button className={styles.container}>
      <h1 className={styles.textStyle}>Patient {number}</h1>
      <div className={styles.textLable}>
        <p className={styles.subData}>nume:</p>
        <p className={styles.dataStyle}>{name}</p>
      </div>
      <div className={styles.textLable1}>
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
