import { Link } from "react-router";
import styles from "./Home.module.css";

export function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.topTab}>
        <Link to="/doctors/login">
          <button className={styles.buttonLoginStyle}>Login</button>
        </Link>
      </div>
      <div className={styles.bottomTab}>
        <h1 className={styles.titleStyle}>MedicaBase</h1>
        <div className={styles.middleLable}>
          <div className={styles.doctorSection}>
            <p className={styles.doctorTextStyle}>
              Create your own medical base to store information about your
              patient with MedicaBase.
            </p>
            <Link to="/doctors/register">
              <button className={styles.buttonRegisterStyle}>
                Create Account
              </button>
            </Link>
          </div>
          <div className={styles.patientSection}>
            <p className={styles.patientTextStyle}>
              View your data asa a patient.
            </p>
            <Link to="/patients/login">
              <button className={styles.buttonPatientStyle}>Patient</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
