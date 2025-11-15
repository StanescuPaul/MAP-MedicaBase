import { Link } from "react-router";
import styles from "./Home.module.css";

export function Home() {
  return (
    <div className={styles.container}>
      <h1>MedAllergyHub</h1>
      <div className={styles.buttonBody}>
        <Link to="/doctors/login">
          <button className={styles.buttonLoginStyle}>Login</button>
        </Link>
        <button className={styles.buttonPatientStyle}>Patients</button>
      </div>
    </div>
  );
}
