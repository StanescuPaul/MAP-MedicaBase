import styles from "./KDoctor.module.css";

export function KDoctor({ name }) {
  return (
    <div className={styles.container}>
      <div className={styles.doctorCard}>
        <div className={styles.topLable}>
          <p className={styles.titleStyle}>Doctor</p>
          <img
            className={styles.profileImage}
            src={require("../../assets/Paul.jpg")}
            alt="Poza"
          />
        </div>
        <div className={styles.dataContainer}>
          {/* <p className={styles.subdataStyle}>nume</p> */}
          <p className={styles.dataStyle}>{name}</p>
        </div>
      </div>
    </div>
  );
}
