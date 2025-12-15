import { useState } from "react";
import { Link } from "react-router-dom";
import { KButton } from "../../components/button/KButton";
import { KInput } from "../../components/input/KInput";
import styles from "./DoctorRegister.module.css";

export function DoctorRegister() {
  const [form, setForm] = useState({
    name: "",
    userName: "",
    password: "",
  });
  const [allert, setAllert] = useState(null);

  const handleOnSignIn = async () => {
    try {
      //const rawResponse primste raspunsul de la server dupa ce trimitem datele
      const rawResponse = await fetch(
        "http://localhost:5000/api/doctors/register",
        {
          //Ruta unde face actiunile
          method: "POST", //metoda pe care o folosim, GET e default
          headers: {
            "Content-Type": "application/json", //Anuntam server-ul ca datele sun JSON
          },
          body: JSON.stringify(form), //transformam datele in string json si le trimitem
        }
      );

      const data = await rawResponse.json(); //in data preluam raspunsul de la backend format json pentru a putea folosi raspunsul ca pe un obiect ca un plic pe care il deschidem ca la then.then. tot asa.
      //rawResponse e o promisiune deci trebuie await sa asteptam raspunsul
      if (rawResponse.ok) {
        //.ok este o conventie daca am raspuns afirmativ cod de la 200-299 de la backend
        setAllert({
          type: data.type, //putem folosi data.success pentru ca asa am facut in sendSucces/sendError
          message: data.data.message || data.message || "Cont creat cu succes", //data.data.message pentru ca in API avem in raspuns un oiect data in care se afla mesajul deci nu poate fi apelat direct cu .message
        });
        setForm({
          name: "",
          userName: "",
          password: "",
        });
      } else {
        setAllert({ type: data.type, message: data.message }); //aici am .message pentru ca nu e un obiect ca si la succes
        setForm({
          name: "",
          userName: "",
          password: "",
        });
      }
    } catch (err) {
      setAllert({
        type: "error",
        message: "Eroare la conectare la server", //eroare de conexiune nu e acelasi lucru cu catch din back-end
      });
    }
  };

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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <KButton onClick={handleOnSignIn} name="Sign in" />
        </div>
        <div className={styles.bottomLable}>
          <p>Existing accout</p>
          <Link to="/doctors/login">
            <KButton name="Login" />
          </Link>
        </div>
      </div>
    </div>
  );
}
