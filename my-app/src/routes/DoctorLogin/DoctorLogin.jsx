import { Link } from "react-router";
import styles from "./DoctorLogin.module.css";
import { useState } from "react";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";
import { useNavigate } from "react-router-dom"; //pentru a putea naviga intr-un if statement
import { API_URL } from "../../config";

//folosim varaibila de mediu pentru portul pe care o sa faca build frontend-ul pentru a putea folosi orice port mapat dorim
//Variabilad de mediu ramane nedeclarata pana in momentul in care avem nevoie de ea (lansare finala cu domeniu) asa ca o sa folosim practic un fetch pe "" + /api/doctors/etc astfel orice port pune el o sa ruleze foarte bine iar daca avem nevoie de o cheie publica la un moment dat doar declaram varaibila demediu in fisier

export function DoctorLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });
  const [allert, setAllert] = useState(null);

  const handleOnLogin = async () => {
    try {
      const rawResponseDoctorLogin = await fetch(
        `${API_URL}/api/doctors/login`,
        {
          method: "POST", //metoda folosita pe ruta
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form), //modul in care trimitem datele catre server
        }
      );
      const responseDoctorLogin = await rawResponseDoctorLogin.json(); // asteptarea datelor de la response

      if (rawResponseDoctorLogin.ok) {
        setAllert({
          type: responseDoctorLogin.type,
          message:
            responseDoctorLogin.data.message ||
            responseDoctorLogin.message ||
            "Conectare realizata cu succes",
        });
        const idDoctor = responseDoctorLogin.data.doctor.id; // luam id din response-ul de la server pentru a-l injecta in url sa accesam doar pacientii acelui doctor, datele se afla in obiectul data din helper acolo e doctor.id
        navigate(`/doctors/${idDoctor}/patients`); // folosim navigate in if statement sa ne redirectioneze doar intr-un anumit caz si Link ca sa ne duca un buton pe acea ruta orice ar fi
        setForm({
          //replace pentru a inlocui ruta login cu ceea la care navigam sa nu mai avem back button
          userName: "",
          password: "",
        });
        localStorage.setItem("token", responseDoctorLogin.data.token); //folosim token jwt
      } else {
        setAllert({
          type: responseDoctorLogin.type,
          message: responseDoctorLogin.message,
        });
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
