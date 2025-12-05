import styles from "./KFormEditDoctor.module.css";
import { useState, useEffect } from "react";

export function KFormEditDoctor({ close, doctorData }) {
  const [doctorUpdateData, setDoctorUpdateData] = useState({
    name: doctorData.name,
    userName: doctorData.userName,
    password: "",
  });

  return (
    <div className={styles.container}>
      <div className={styles.formStyle}>
        <button className={styles.closeStyle} onClick={close}>
          Close
        </button>
        <div className={styles.lableData}>
          <div className={styles.dataGroup}>
            <p className={styles.prefixData}>Name:</p>
            <p className={styles.dataStyle}>{doctorUpdateData.name}</p>
            <button className={styles.editStyle}>Edit</button>
          </div>
          <div className={styles.dataGroup}>
            <p className={styles.prefixData}>User Name:</p>
            <p className={styles.dataStyle}>{doctorUpdateData.userName}</p>
            <button className={styles.editStyle}>Edit</button>
          </div>
          <div className={styles.dataGroup}>
            <button className={styles.passwordChangeStyle}>
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
