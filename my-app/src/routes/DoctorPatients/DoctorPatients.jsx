import { useParams } from "react-router-dom";
import { KDoctor } from "../../components/doctorCard/KDoctor";
import { useState, useEffect } from "react";
import { KPatient } from "../../components/patientCard/KPatient";
import styles from "./DoctorPatients.module.css";

export function DoctorPatients() {
  const { idDoctor } = useParams(); //luam din url id-ul doctorului
  const [doctorName, setDoctorName] = useState("");
  const [patientsData, setPatientsData] = useState([]); //array gol cu toti pacientii
  const [cnp, setCnp] = useState("");

  let number = 1;

  useEffect(() => {
    const dataDoctor = async () => {
      try {
        const responseDoctorData = await fetch(
          //pentru await trebuie sa fiu intr-un async function
          `http://localhost:5000/doctors/${idDoctor}`
        );

        const dataDoctor = await responseDoctorData.json();

        setDoctorName(dataDoctor.data.name || dataDoctor.name); //datele schima doctorName

        const responsePatientsData = await fetch(
          `http://localhost:5000/doctors/${idDoctor}/patients`
        );
        const dataPatients = await responsePatientsData.json();

        setPatientsData(dataPatients.data); //datapatients.data pentru ca acela e obiectul din sendSucces din helper care contine toti pacientii
      } catch (error) {
        console.log("Nu s-a gasit numele in server!!!");
      }
    };
    dataDoctor(); //apelam functia pentru a prelua datele
  }, [idDoctor]); //luam datele din fetch de fiecare data cand se schimba id-ul doctorului

  return (
    <div className={styles.container}>
      <div className={styles.kdoctorLable}>
        <h1 className={styles.textStyle}>MedicaBase</h1>
        <h2 className={styles.textStyle}>User</h2>
        <KDoctor name={doctorName} />
      </div>
      <div className={styles.continutDreapta}>
        <div className={styles.inputLable}>
          <input
            className={styles.inputStyle}
            placeholder="Enter CNP"
            value={cnp}
            onChange={(e) => setCnp(e.target.value)}
          />
          <button className={styles.inpBtnStyle}>FIND</button>
        </div>
        <div className={styles.kpatientsLable}>
          {patientsData.map((patientData) => (
            <KPatient
              key={patientData.id}
              name={patientData.name}
              cnp={patientData.cnp}
              number={number++}
              // createdAt={new Date(patientData.createAt).toLocaleDateString(
              //   "ro-RO" //convetrim datele pentru a avea doar luna anul si ziua
              // )}
              // updatedAt={new Date(patientData.updateAt).toLocaleDateString(
              //   "ro-RO" //convetrim datele pentru a avea doar luna anul si ziua
              // )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
