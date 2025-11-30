import styles from "./DoctorPatient.module.css";
import { useEffect, useState } from "react";
import { KDoctor } from "../../components/doctorCard/KDoctor";
import { useParams } from "react-router-dom";

export function DoctorPatient() {
  const [patientData, setPatientData] = useState({
    name: "",
    cnp: "",
    alergies: [],
    createAt: "",
    updateAt: "",
  });
  const [doctorName, setDoctorName] = useState();
  const { idDoctor, idPatient } = useParams();

  useEffect(() => {
    const data = async () => {
      try {
        const rawResponseDoctorData = await fetch(
          `http://localhost:5000/doctors/${idDoctor}`
        );
        const responseDoctorData = await rawResponseDoctorData.json();
        setDoctorName(responseDoctorData.data.name || responseDoctorData.name);

        const rawResponsePatientData = await fetch(
          `http://localhost:5000/doctors/${idDoctor}/patients/${idPatient}`
        );
        const responsePatientData = await rawResponsePatientData.json();
        setPatientData(responsePatientData.data || responsePatientData);
      } catch (err) {
        console.log("Eroare la conectare la serve!!!");
      }
    };
    data();
  }, [idPatient, idDoctor]);

  return (
    <div className={styles.container}>
      <div className={styles.doctorView}>
        <h1 className={styles.textStyle}>MedicaBase</h1>
        <h2 className={styles.textStyle}>User</h2>
        <KDoctor name={doctorName} />
      </div>
      <div className={styles.patientView}>
        <div className={styles.patientDataView}>
          <div className={styles.alignData}>
            <p className={styles.prefixStyle}>Name:</p>
            <p className={styles.dataStyle}>{patientData.name}</p>
          </div>
          <div className={styles.alignData}>
            <p className={styles.prefixStyle}>CNP:</p>
            <p className={styles.dataStyle}>{patientData.cnp}</p>
          </div>
          <div className={styles.alignData}>
            <p className={styles.prefixStyle}>Created at:</p>
            <p className={styles.dataStyle}>
              {new Date(patientData.createAt).toLocaleDateString("ro-RO")}
              {/*convertire la data corecta*/}
            </p>
          </div>
          <div className={styles.alignData}>
            <p className={styles.prefixStyle}>Updated at:</p>
            <p className={styles.dataStyle}>
              {new Date(patientData.updateAt).toLocaleDateString("ro-RO")}
            </p>
          </div>
          <div className={styles.alignData}>
            <p className={styles.prefixStyle}>allergies:</p>
            {patientData.alergies.map((alergy, index) => (
              <p key={index} className={styles.dataStyle}>
                {alergy.name},
              </p>
            ))}
            <button className={styles.addStyle}>+</button>
          </div>
          <button className={styles.deleteStyle}>Delete patient</button>
        </div>
      </div>
    </div>
  );
}
