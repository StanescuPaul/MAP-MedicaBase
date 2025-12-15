import styles from "./PatientProfile.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

export function PatientProfile() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    doctorName: "",
    name: "",
    cnp: "",
    allergies: [],
    createAt: "",
    updateAt: "",
  });
  const { idPatient } = useParams();

  useEffect(() => {
    const dataPatientFetch = async () => {
      try {
        const rawDataPatient = await fetch(
          `http://localhost:5000/api/patients/${idPatient}`
        );

        const dataPatient = await rawDataPatient.json();

        if (rawDataPatient.ok) {
          setPatientData({
            doctorName: dataPatient.data.doctor.name,
            name: dataPatient.data.name,
            cnp: dataPatient.data.cnp,
            allergies: dataPatient.data.alergies,
            createAt: dataPatient.data.createAt,
            updateAt: dataPatient.data.updateAt,
          });
        } else {
          console.log("Error fetching the data");
        }
      } catch (error) {
        console.log("Error connecting to the server", error);
      }
    };
    dataPatientFetch();
  }, [idPatient]);

  const handleOnExit = () => {
    localStorage.removeItem("sesionPatientId");
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileStyle}>
        <div className={styles.titleDoctor}>
          <p className={styles.prefixDataDoctor}>Doctor</p>
          <p className={styles.dataStyleDoctor}>{patientData.doctorName}</p>
        </div>
        <div className={styles.patientData}>
          <div className={styles.dataLable}>
            <p className={styles.prefixData}>Name:</p>
            <p className={styles.dataStyle}>{patientData.name}</p>
          </div>
          <div className={styles.dataLable}>
            <p className={styles.prefixData}>CNP:</p>
            <p className={styles.dataStyle}>{patientData.cnp}</p>
          </div>
          <div className={styles.dataLable}>
            <p className={styles.prefixData}>Allergies: </p>
            {patientData.allergies.map((allergy) => (
              <p className={styles.dataStyle}>{allergy.name},</p>
            ))}
          </div>
          <div className={styles.dataLable}>
            <p className={styles.prefixData}>First visit:</p>
            <p className={styles.dataStyle}>
              {new Date(patientData.createAt).toLocaleDateString("ro-RO")}
            </p>
          </div>
          <div className={styles.dataLable}>
            <p className={styles.prefixData}>Last update:</p>
            <p className={styles.dataStyle}>
              {new Date(patientData.updateAt).toLocaleDateString("ro-RO")}
            </p>
          </div>
        </div>
        <button className={styles.exitStyle} onClick={handleOnExit}>
          Exit
        </button>
      </div>
    </div>
  );
}
