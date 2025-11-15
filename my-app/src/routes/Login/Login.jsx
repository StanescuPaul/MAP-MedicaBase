import { Link } from "react-router";
import styles from "./Login.module.css";
import { useState } from "react";

export function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  function onLogin() {
    if (userName === "" || password === "") {
      setAlert("Name and password must be completed!");
      return;
    }
    if (password.length < 8) {
      setAlert("Password must have at least 8 charaters!");
      return;
    }
    setUserName("");
    setPassword("");
    setAlert("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBody}>
        <h3>Login</h3>
        <p className={styles.alertStyle}>{alert}</p>
        <input
          type="text"
          placeholder="User name"
          className={styles.usernameStyle}
          value={userName}
          onChange={(userName) => setUserName(userName.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.passwordStyle}
          value={password}
          onChange={(password) => setPassword(password.target.value)}
        />
        <button onClick={onLogin}>Login</button>
        <div className={styles.bottomStyle}>
          <p>Create account</p>
          <Link to="/doctors/register">
            <button>Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
