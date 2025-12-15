import { Link } from "react-router";
import styles from "./DoctorLogin.module.css";
import { useState } from "react";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";
import { useNavigate } from "react-router-dom"; //pentru a putea naviga intr-un if statement

export function DoctorLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });
  const [allert, setAllert] = useState(null);

  const handleOnLogin = async () => {
    try {
      const rawResponse = await fetch(
        "http://localhost:5000/api/doctors/login",
        {
          method: "POST", //metoda folosita pe ruta
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form), //modul in care trimitem datele catre server
        }
      );
      const data = await rawResponse.json(); // asteptarea datelor de la response

      if (rawResponse.ok) {
        setAllert({
          type: data.type,
          message:
            data.data.message ||
            data.message ||
            "Conectare realizata cu succes",
        });
        const idDoctor = data.data.doctor.id; // luam id din response-ul de la server pentru a-l injecta in url sa accesam doar pacientii acelui doctor, datele se afla in obiectul data din helper acolo e doctor.id
        navigate(`/doctors/${idDoctor}/patients`, { replace: true }); // folosim navigate in if statement sa ne redirectioneze doar intr-un anumit caz si Link ca sa ne duca un buton pe acea ruta orice ar fi
        setForm({
          //replace pentru a inlocui ruta login cu ceea la care navigam sa nu mai avem back button
          userName: "",
          password: "",
        });
        localStorage.setItem("sesionDoctorId", idDoctor); //folosim token idDoctor
      } else {
        setAllert({ type: data.type, message: data.message });
        setForm({
          userName: "",
          password: "",
        });
      }
    } catch (err) {
      setAllert({ type: "error", message: "Eroare la conectare la server" });
      setForm({
        userName: "",
        password: "",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBody}>
        <div className={styles.topStyle}>
          <h3 className={styles.loginText}>Login</h3>
          {allert && (
            <p className={`${styles.allertStyle} ${styles[allert.type]}`}>
              {allert.message}
            </p> //style in functie de tipul mesajului
          )}
          <div className={styles.inpStyle}>
            <KInput
              type="text"
              placeholder="User name"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
            <KInput
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <KButton
              type="button"
              onClick={handleOnLogin}
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
