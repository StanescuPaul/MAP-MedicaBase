import styles from "./DoctorProfile.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function KDoctorProfile() {
  const [doctorData, setDoctorData] = useState({
    name: "",
    userName: "",
    createAt: "",
    updateAt: "",
    patientCount: 0,
  });
  const { idDoctor } = useParams();
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    const dataDoctor = async () => {
      try {
        const rawDataDotor = await fetch(
          `http://localhost:5000/doctors/${idDoctor}`
        );

        const dataDoctor = await rawDataDotor.json();

        setDoctorData({
          name: dataDoctor.data.name,
          userName: dataDoctor.data.userName,
          createAt: dataDoctor.data.createAt,
          updateAt: dataDoctor.data.updateAt,
          patientCount: dataDoctor.data.patientCount,
        });
      } catch (err) {
        console.log("Error conecting to the server");
      }
    };
    dataDoctor();
  }, [idDoctor]);

  const handleOnDelete = () => {
    setDeleteVisible(true);
  };
  const handleOnCancelDelete = () => {
    setDeleteVisible(false);
  };
  const handleOnOkDelete = async () => {};

  return (
    <div className={styles.container}>
      <div className={styles.profileLable}>
        <div className={styles.dataLable}>
          <div className={styles.dataGroup}>
            <p className={styles.prefixData}>Name:</p>
            <p className={styles.dataStyle}>{doctorData.name}</p>
          </div>
          <div className={styles.dataGroup}>
            <p className={styles.prefixData}>UserName:</p>
            <p className={styles.dataStyle}>{doctorData.userName}</p>
          </div>
          <div className={styles.dataGroup}>
            <p className={styles.prefixData}>Created:</p>
            <p className={styles.dataStyle}>
              {new Date(doctorData.createAt).toLocaleDateString("ro-RO")}
            </p>
          </div>
          <div className={styles.dataGroup}>
            <p className={styles.prefixData}>Updated:</p>
            <p className={styles.dataStyle}>
              {new Date(doctorData.updateAt).toLocaleDateString("ro-RO")}
            </p>
          </div>
        </div>
        <div className={styles.countLable}>
          <p className={styles.countStyleName}>Patients</p>
          <div className={styles.countBody}>
            <p className={styles.countStyle}>{doctorData.patientCount}</p>
          </div>
        </div>
        <button className={styles.deleteBtnStyle} onClick={handleOnDelete}>
          Delete
        </button>
        {deleteVisible && (
          <div className={styles.deleteAskStyle}>
            <div className={styles.deleteAskLable}>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the profile?
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
        <button className={styles.editBtnStyle}>Edit</button>
      </div>
    </div>
  );
}
