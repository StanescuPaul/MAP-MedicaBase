import { Link } from "react-router";
import styles from "./Home.module.css";

export function Home() {
  return (
    <div className={styles.container}>
      <h1>MedicaBase</h1>
      <div className={styles.buttonBody}>
        <Link to="/doctors/login">
          <button className={styles.buttonLoginStyle}>Login</button>
        </Link>
        <Link to="/patients/login">
          <button className={styles.buttonPatientStyle}>Patients</button>
        </Link>
      </div>
    </div>
  );
}
