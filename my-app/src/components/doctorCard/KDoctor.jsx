import styles from "./KDoctor.module.css";

export function KDoctor({ name, onClick, imgUrl }) {
  const finalImage = imgUrl
    ? `http://localhost:5000/${imgUrl}`
    : require("../../assets/user.png");
  return (
    <button className={styles.container} onClick={onClick}>
      <div className={styles.doctorCard}>
        <div className={styles.topLable}>
          <p className={styles.titleStyle}>Doctor</p>
          <img className={styles.profileImage} src={finalImage} alt="Poza" />
        </div>
        <div className={styles.dataContainer}>
          {/* <p className={styles.subdataStyle}>nume</p> */}
          <p className={styles.dataStyle}>{name}</p>
        </div>
      </div>
    </button>
  );
}
