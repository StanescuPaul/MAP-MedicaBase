import styles from "./DoctorProfile.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { KFormEditDoctor } from "../../components/formEditDoctor/KFormEditDoctor";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export function KDoctorProfile() {
  const navigate = useNavigate();
  const { idDoctor } = useParams();
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isEditingVisible, setIsEditingVisible] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: "",
    userName: "",
    createAt: "",
    updateAt: "",
    patientCount: 0,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [alertProfilePicture, setAlertProfilePicture] = useState(null);

  const fetchDataDoctor = useCallback(async () => {
    try {
      const rawDataDotor = await fetch(`${API_URL}/api/doctors/${idDoctor}`);

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
  }, [idDoctor]);

  useEffect(() => {
    fetchDataDoctor();
  }, [idDoctor, fetchDataDoctor]);

  const handleOnShowDelete = () => {
    setIsDeleteVisible(true);
  };
  const handleOnCancelDelete = () => {
    setIsDeleteVisible(false);
  };
  const handleOnOkDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const rawResponseDelete = await fetch(
        `${API_URL}/api/doctors/${idDoctor}`,
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
        navigate("/", { replace: true });
        localStorage.removeItem("token");
      } else {
        console.log("Error deleting the account");
      }

      console.log(responseDelete.message);
    } catch (err) {
      console.log("Error to connect to the server");
    }
  };

  const handleOnEditShow = () => {
    setIsEditingVisible(true);
  };
  const handleOnEditClose = () => {
    setIsEditingVisible(false);
  };

  const handleOnLogOut = () => {
    localStorage.removeItem("token"); //stergem token-ul din istoricul local
    navigate("/", { replace: true });
  };

  const handleOnAddPhoto = async () => {
    const formData = new FormData(); // pentru fisiere poze etc ai nevoie de FormData pentru tipul de date multipart/form-data
    formData.append("profilePicture", profileImage); //profilePicture trebuie sa fie mesajul din backend din upload.single
    //cu formData.apend atribui valorii profilePicture din multer valoarea preluata din frontend
    try {
      const token = localStorage.getItem("token");

      const rawResponsePhoto = await fetch(
        `${API_URL}/api/doctors/${idDoctor}/upload-photo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responsePhoto = await rawResponsePhoto.json();

      if (rawResponsePhoto.ok) {
        setAlertProfilePicture({
          type: responsePhoto.type,
          message: responsePhoto.data.message,
        });
      } else {
        setAlertProfilePicture({
          type: responsePhoto.type,
          message: responsePhoto.message,
        });
      }
    } catch (error) {
      console.log("Error connecting to the server", error);
    }
  };

  useEffect(() => {
    if (alertProfilePicture) {
      const timer = setTimeout(() => {
        setAlertProfilePicture(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alertProfilePicture]);

  return (
    <div className={styles.container}>
      <div className={styles.profileLable}>
        <p className={styles.addPhotoText}>Add profile picture</p>
        <div className={styles.addPhotoLable}>
          <input
            type="file"
            accept="image/*"
            className={styles.addImageInput}
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <button className={styles.addPhotoButton} onClick={handleOnAddPhoto}>
            +
          </button>
        </div>
        {alertProfilePicture && (
          <p
            className={`${styles.alertPhotoStyle} ${
              styles[alertProfilePicture.type]
            }`}
          >
            {alertProfilePicture.message}
          </p>
        )}
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
        <button className={styles.deleteBtnStyle} onClick={handleOnShowDelete}>
          Delete
        </button>
        {isDeleteVisible && (
          <div className={styles.deleteAskStyle}>
            <div className={styles.deleteAskLable}>
              <p className={styles.deleteMessage}>
                Are you sure you want to delete the account?
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
        <button className={styles.editBtnStyle} onClick={handleOnEditShow}>
          Edit
        </button>
        {isEditingVisible && (
          <KFormEditDoctor
            close={handleOnEditClose}
            doctorData={doctorData}
            idDoctor={idDoctor}
            callBack={fetchDataDoctor}
          />
        )}
        <button className={styles.logOutStyle} onClick={handleOnLogOut}>
          Log out
        </button>
      </div>
    </div>
  );
}
