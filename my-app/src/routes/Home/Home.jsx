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
        <div className={styles.textLable}>
          <p className={styles.textStyle}>
            Create your own medical base to store your patients allergies with
            MedicaBase or see your allergies as a patient.
          </p>
        </div>
        <div className={styles.buttonLable}>
          <Link to="/doctors/register">
            <button className={styles.buttonRegisterStyle}>
              Create account
            </button>
          </Link>
          <Link to="/patients/login">
            <button className={styles.buttonPatientStyle}>Patients</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
