import styles from "./KFormUpdate.module.css";
import { useEffect, useState } from "react";

export function KFormUpdate({ close, patient }) {
  const uniqueId = () => Date.now() + Math.random();
  const initialAllergies = patient.alergies
    ? patient.alergies.map((alergy) => ({ id: uniqueId, value: alergy }))
    : [];
  const [patientData, setPatientData] = useState({
    name: patient.name || "",
    cnp: patient.cnp || "",
    alergies: initialAllergies,
    createAt: patient.createAt || "",
    updateAt: patient.updateAt || "",
  });
  const [alert, setAlert] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.formStyle}>
        <button className={styles.closeStyle} onClick={close}>
          X
        </button>
        <div className={styles.inputLable}>
          <input className={styles.inputStyle} placeholder="Allergy" />
          <button className={styles.deleteStyle}>X</button>
          <button className={styles.addStyle}>+</button>
        </div>
        <button className={styles.updateStyle}>Update</button>
      </div>
    </div>
  );
}
