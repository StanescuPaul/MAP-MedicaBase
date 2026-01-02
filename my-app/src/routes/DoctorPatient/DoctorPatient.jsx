import styles from "./DoctorPatient.module.css";
import { useEffect, useState } from "react";
import { KDoctor } from "../../components/doctorCard/KDoctor";
import { useParams } from "react-router-dom";
import { KFormUpdate } from "../../components/addButton/KFormUpdate";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export function DoctorPatient() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    name: "",
    cnp: "",
    alergies: [],
    createAt: "",
    updateAt: "",
  });
  const [doctorData, setDoctorData] = useState({
    name: "",
    imgUrl: "",
  });
  const { idDoctor, idPatient } = useParams();
  const [visible, setVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const [visibleDelete, setVisibleDelete] = useState(false);

  //fetch date doctor si pacient
  useEffect(() => {
    const data = async () => {
      try {
        const rawResponseDoctorData = await fetch(
          `${API_URL}/api/doctors/${idDoctor}`
        );
        const responseDoctorData = await rawResponseDoctorData.json();
        setDoctorData({
          name: responseDoctorData.data.name,
          imgUrl: responseDoctorData.data.profileImgUrl,
        });

        const rawResponsePatientData = await fetch(
          `${API_URL}/api/doctors/${idDoctor}/patients/${idPatient}`
        );
        const responsePatientData = await rawResponsePatientData.json();
        setPatientData(responsePatientData.data || responsePatientData);
      } catch (err) {
        console.log("Eroare la conectare la serve!!!");
      }
    };
    data();
  }, [idPatient, idDoctor]);

  //inchidere deschidere formular de update
  function handleOnAdd() {
    setVisible(true);
  }
  function handleOnClose() {
    setVisible(false);
  }

  //functie de fetch pentru rerandare
  const fetchDataPatient = async () => {
    try {
      const token = localStorage.getItem("token"); // luam token-ul din local storage pentru a-l trimite in header

      const rawData = await fetch(
        `${API_URL}/api/doctors/${idDoctor}/patients/${idPatient}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //aici trimitem token-ul in header pentru a-l putea prelua backendul foarte important de incepe cu Bearer si spatiu
          },
        }
      );

      const data = await rawData.json();

      setPatientData(data.data);
    } catch (err) {
      console.log("Eroare la conectare la server");
    }
  };

  const handleOnDelete = () => {
    setVisibleDelete(true);
  };
  const handleOnCancelDelete = () => {
    setVisibleDelete(false);
  };

  //functie pentru a sterge pacient
  const handleOnOkDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const rawResponseDelete = await fetch(
        `${API_URL}/api/doctors/${idDoctor}/patients/${idPatient}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseDelete = await rawResponseDelete.json();

      if (rawResponseDelete.ok) {
        navigate(`/doctors/${idDoctor}/patients`, { replace: true });
        setAlert({
          type: responseDelete.type,
          message: `Patient ${patientData.name} deleted succesfuly`,
        });
      } else {
        setAlert({
          type: responseDelete.type,
          message: responseDelete.message,
        });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Error to delete the patient" });
    }
  };

  const handleOnKDoctor = () => {
    navigate(`/doctors/${idDoctor}`, { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.doctorView}>
        <h1 className={styles.textStyle}>MedicaBase</h1>
        <h2 className={styles.textStyle}>User</h2>
        <KDoctor
          name={doctorData.name}
          onClick={handleOnKDoctor}
          imgUrl={doctorData.imgUrl}
        />
      </div>
      {visibleDelete && (
        <div className={styles.deleteAskStyle}>
          <div className={styles.deleteAskLable}>
            <p className={styles.deleteMessage}>
              Are you sure you want to delete this patient?
            </p>
            <div className={styles.btnLableDelete}>
              <button className={styles.yesStyle} onClick={handleOnOkDelete}>
                Yes
              </button>
              <button
                className={styles.cancelStyle}
                onClick={handleOnCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.patientView}>
        <div className={styles.patientDataView}>
          {alert && (
            <p className={`${styles.alertStyle} ${styles[alert.type]}`}>
              {alert.message}
            </p>
          )}
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
          </div>
          <button className={styles.addStyle} onClick={handleOnAdd}>
            Edit
          </button>
          {visible && (
            <KFormUpdate
              close={handleOnClose}
              patient={patientData}
              idDoctor={idDoctor}
              update={fetchDataPatient}
            />
          )}
          <button className={styles.deleteStyle} onClick={handleOnDelete}>
            Delete patient
          </button>
        </div>
      </div>
    </div>
  );
}
