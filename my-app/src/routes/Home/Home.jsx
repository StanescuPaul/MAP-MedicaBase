import { Link } from "react-router";
import styles from "./Home.module.css";

export function Home() {
  return (
    <div className={styles.container}>
      <h1>Home</h1>
      <div className={styles.buttonBody}>
        <Link to="/doctors/login">
          <button className={styles.buttonStyle}>Login</button>
        </Link>
        <button className={styles.buttonStyle}>Patients</button>
      </div>
    </div>
  );
}
