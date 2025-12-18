import styles from "./PatientLogin.module.css";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export function PatientLogin() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [patientAccount, setPatientAccount] = useState({
    name: "",
    cnp: "",
  });

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

  const handleOnLogin = async () => {
    try {
      const rawResponseLoginPatient = await fetch(
        `${API_URL}/api/patients/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientAccount),
        }
      );

      const responseLoginPatient = await rawResponseLoginPatient.json();

      const idPatient = responseLoginPatient.data.patient.id;

      if (rawResponseLoginPatient.ok) {
        setAlert({
          type: responseLoginPatient.type,
          message: "Login succesfully",
        });
        navigate(`/patients/${idPatient}`, { replace: true });
        localStorage.setItem("sesionPatientId", idPatient);
      } else {
        setAlert({
          type: responseLoginPatient.type,
          message: responseLoginPatient.message,
        });
        setPatientAccount({
          ...patientAccount,
          cnp: "",
        });
      }
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.patientLoginStyle}>
        <h1 className={styles.headerStyle}>Login</h1>
        {alert && (
          <p className={`${styles.alertStyle} ${styles[alert.type]}`}>
            {alert.message}
          </p>
        )}
        <KInput
          placeholder="Name"
          value={patientAccount.name}
          onChange={(e) =>
            setPatientAccount({ ...patientAccount, name: e.target.value })
          }
        />
        <KInput
          placeholder="CNP"
          value={patientAccount.cnp}
          onChange={(e) =>
            setPatientAccount({ ...patientAccount, cnp: e.target.value })
          }
        />
        <KButton name="Login" onClick={handleOnLogin} />
      </div>
    </div>
  );
}
