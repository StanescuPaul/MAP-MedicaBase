import styles from "./KDoctor.module.css";
import { API_URL } from "../../config";

export function KDoctor({ name, onClick, imgUrl }) {
  const finalImage = imgUrl
    ? `${API_URL}/${imgUrl}`
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
