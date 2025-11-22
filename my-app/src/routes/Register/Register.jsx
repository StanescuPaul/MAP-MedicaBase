import { useState } from "react";
import { Link } from "react-router";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";
import styles from "./Register.module.css";

export function Register() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [allert, setAllert] = useState(null);

  function handleOnSignIn() {
    if (!name || !userName || !password) {
      setAllert({ type: "error", message: "Everything must be completed !" });
      setName("");
      setUserName("");
      setPassword("");
      return;
    }
    if (userName.length < 8 || password.length < 8) {
      setAllert({
        type: "error",
        message: "USERNAME and PASSWORD must have at least 8 characters !",
      });
      setName("");
      setUserName("");
      setPassword("");
      return;
    }
    setAllert({ type: "succes", message: "Account created" });
    setName("");
    setUserName("");
    setPassword("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.registerBody}>
        <h1 className={styles.titleStyle}>Create account</h1>
        <div className={styles.middleLable}>
          {allert && (
            <p className={`${styles.alert} ${styles[allert.type]}`}>
              {/* concatenam 2 style-uri */}
              {allert.message}
            </p> //daca exista alerta o afisam cu propriul ei style in functie de tipul ei am trasformat allert intr-un obiect cu type si message
          )}
          <KInput
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <KInput
            type="text"
            placeholder="User name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <KInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <KButton onClick={handleOnSignIn} name="Sign in" />
        </div>
        <div className={styles.bottomLable}>
          <p>Existing accout</p>
          <Link to="/doctors/login">
            <KButton name="To Login" />
          </Link>
        </div>
      </div>
    </div>
  );
}
