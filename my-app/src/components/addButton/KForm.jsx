import styles from "./KForm.module.css";
import { useEffect, useState } from "react";

export function KForm({ close }) {
  const [allergis, setAllergis] = useState([]);
  const [alert, setAlert] = useState(null);

  function handleOnAddAlergi() {
    if (allergis.length < 8) {
      setAllergis((prevAllergi) => [...prevAllergi, prevAllergi.length + 1]); // pentru ca fiecare valoare a alergiilor depinde de cea anetrioara
      setAlert(null);
    } else {
      setAlert("Numarul maxim de alergii a fost atins");
    }
  }

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000); //timpul in care sa dispara alerta
      return () => {
        clearTimeout(timer); //curatam timer-ul
      };
    }
  }, [alert]); //use effect de fiecare data cand se schimba alerta

  function handleOnDelete(index) {
    const deletedAllergi = allergis.filter(
      (allergiIndex) => allergiIndex !== index
    );
    setAllergis(deletedAllergi);
    id--;
  }

  let id = 1;
  return (
    <div className={styles.fundalStyle}>
      <div className={styles.formStyle}>
        <button className={styles.backStyle} onClick={close}>
          {" "}
          {/* prin intermediul proms-ului trimitem functia prin care setam false la setIsFormOpen si se inchide formul */}
          X
        </button>
        {alert && <p className={styles.alertStyle}>{alert}</p>}
        <input className={styles.inputStyle} placeholder="Nume" />
        <input className={styles.inputStyle} placeholder="CNP" />
        {allergis.map((index) => (
          <div className={styles.inpAllergiLable}>
            <input
              key={index}
              className={styles.inputStyle}
              placeholder={`Alergia ${id++}`}
            />
            <button
              type="button"
              className={styles.deleteStyle}
              onClick={() => handleOnDelete(index)} // daca am doar handleOnDelete se apeleaza incontinu nu doar la click
            >
              X
            </button>
          </div>
        ))}
        <button className={styles.addInpStyle} onClick={handleOnAddAlergi}>
          Add allergi
        </button>
      </div>
    </div>
  );
}
