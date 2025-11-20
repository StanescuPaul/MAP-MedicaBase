import { Link } from "react-router";
import styles from "./Login.module.css";
import { useState } from "react";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";

export function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  function onLogin() {
    if (userName === "" || password === "") {
      setAlert("Name and password must be completed!");
      setUserName("");
      setPassword("");
      return;
    }
    if (password.length < 8) {
      setAlert("Password must have at least 8 charaters!");
      setUserName("");
      setPassword("");
      return;
    }
    setUserName("");
    setPassword("");
    setAlert("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBody}>
        <div className={styles.topStyle}>
          <h3 className={styles.loginText}>Login</h3>
          <p className={styles.alertStyle}>{alert}</p>
          <div className={styles.inpStyle}>
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
            <KButton
              type="button"
              onClick={onLogin}
              className={styles.buttonStyle}
              name="Login"
            />
          </div>
        </div>
        <div className={styles.bottomStyle}>
          <p className={styles.registerText}>Create account</p>
          <Link to="/doctors/register">
            <KButton name="Sign in" />
          </Link>
        </div>
      </div>
    </div>
  );
}
