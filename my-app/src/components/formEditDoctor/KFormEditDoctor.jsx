import styles from "./KFormEditDoctor.module.css";
import { useState, useEffect } from "react";

export function KFormEditDoctor({ close, doctorData, idDoctor, callBack }) {
  const [alert, setAlert] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [doctorUpdateData, setDoctorUpdateData] = useState({
    newName: doctorData.name,
    newUserName: doctorData.userName,
  });

  const handleOnEditName = () => {
    setIsEditingName(true);
  };
  const handleOnSaveName = () => {
    setIsEditingName(false);
  };
  const handleOnEditUserName = () => {
    setIsEditingUserName(true);
  };
  const handleOnSaveUserName = () => {
    setIsEditingUserName(false);
  };
  const handleOnChangePassword = () => {
    setDoctorUpdateData({
      ...doctorUpdateData,
      newPassword: "",
      currentPassword: "",
    });
    setIsEditingPassword(true);
  };
  const handleOnCancelChangePassword = () => {
    setDoctorUpdateData((prevState) => ({
      newName: prevState.newName,
      newUserName: prevState.newUserName,
    }));
    setIsEditingPassword(false);
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alert]);

  const handleOnUpdateDoctor = async () => {
    if (
      doctorUpdateData.newName === doctorData.name &&
      doctorUpdateData.newUserName === doctorData.userName &&
      !doctorUpdateData.newPassword
    ) {
      setAlert({ type: "error", message: "There is no updates" });
      return;
    }

    try {
      const rawResponseUpdate = await fetch(
        `http://localhost:5000/doctors/${idDoctor}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctorUpdateData),
        }
      );

      const responseUpdate = await rawResponseUpdate.json();

      if (rawResponseUpdate.ok) {
        if (
          doctorUpdateData.newPassword &&
          doctorUpdateData.newPassword === doctorUpdateData.currentPassword
        ) {
          setAlert({ type: "error", message: "Password has no changes" });
          return;
        }
        setAlert({ type: responseUpdate.type, message: "Update succesfully" });
        callBack();
      } else {
        setAlert({
          type: responseUpdate.type,
          message:
            responseUpdate.message || "Error updateing the doctor profile",
        });
        if (doctorUpdateData.newPassword && doctorUpdateData.currentPassword) {
          setDoctorUpdateData({
            ...doctorUpdateData,
            newPassword: "",
            currentPassword: "",
          });
        }
      }
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formStyle}>
        <button className={styles.closeStyle} onClick={close}>
          Close
        </button>
        <div className={styles.lableData}>
          {alert && (
            <p className={`${styles.alertStyle} ${styles[alert.type]}`}>
              {alert.message}
            </p>
          )}
          {isEditingName ? (
            <div className={styles.dataGroup}>
              <input
                className={styles.inputStyle}
                placeholder="Name"
                value={doctorUpdateData.newName}
                onChange={(e) =>
                  setDoctorUpdateData({
                    ...doctorUpdateData,
                    newName: e.target.value,
                  })
                }
              />
              <button className={styles.editStyle} onClick={handleOnSaveName}>
                Save
              </button>
            </div>
          ) : (
            <div className={styles.dataGroup}>
              <p className={styles.prefixData}>Name:</p>
              <p className={styles.dataStyle}>{doctorUpdateData.newName}</p>
              <button className={styles.editStyle} onClick={handleOnEditName}>
                Edit
              </button>
            </div>
          )}
          <div className={styles.dataGroup}>
            {isEditingUserName ? (
              <div className={styles.dataGroup}>
                <input
                  className={styles.inputStyle}
                  placeholder="User name"
                  value={doctorUpdateData.newUserName}
                  onChange={(e) =>
                    setDoctorUpdateData({
                      ...doctorUpdateData,
                      newUserName: e.target.value,
                    })
                  }
                />
                <button
                  className={styles.editStyle}
                  onClick={handleOnSaveUserName}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className={styles.dataGroup}>
                <p className={styles.prefixData}>User name:</p>
                <p className={styles.dataStyle}>
                  {doctorUpdateData.newUserName}
                </p>
                <button
                  className={styles.editStyle}
                  onClick={handleOnEditUserName}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div className={styles.dataGroup}>
            {isEditingPassword ? (
              <div className={styles.inputPasswordLable}>
                <input
                  className={styles.inputStyle}
                  placeholder="Current password"
                  type="password"
                  value={doctorUpdateData.currentPassword}
                  onChange={(e) =>
                    setDoctorUpdateData({
                      ...doctorUpdateData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <input
                  className={styles.inputStyle}
                  placeholder="New password"
                  type="password"
                  value={doctorUpdateData.newPassword}
                  onChange={(e) =>
                    setDoctorUpdateData({
                      ...doctorUpdateData,
                      newPassword: e.target.value,
                    })
                  }
                />
                <button
                  className={styles.cancelPasswordStyle}
                  onClick={handleOnCancelChangePassword}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className={styles.passwordChangeStyle}
                onClick={handleOnChangePassword}
              >
                Change password
              </button>
            )}
          </div>
          <button
            className={styles.updateButtonStyle}
            onClick={handleOnUpdateDoctor}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
