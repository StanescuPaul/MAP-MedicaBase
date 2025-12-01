import styles from "./KFormUpdate.module.css";
import { useEffect, useState } from "react";

export function KFormUpdate({ close, patient, idDoctor, update }) {
  const uniqueId = () => Date.now() + Math.random();

  //alergii noi
  const [newAllergies, setNewAllergies] = useState([]);
  const [alert, setAlert] = useState(null);

  //functie pentru adaugare inputuri
  const handleOnAddAlergi = () => {
    if (newAllergies.length < 8) {
      setNewAllergies([...newAllergies, { id: uniqueId(), value: "" }]);
      setAlert(null);
    } else {
      setAlert({
        type: "error",
        message: "The maximum allergy limit has been reached",
      });
    }
  };

  //functie fade la alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alert]);

  //functie pentru setarea alergiei
  const handleAllergiesChange = (idToUpdate, value) => {
    setNewAllergies(
      newAllergies.map((allergy) =>
        allergy.id === idToUpdate ? { ...allergy, value: value } : allergy
      )
    );
  };

  //functie pentru a sterge un input
  const handleOnDelete = (idToDelete) => {
    setNewAllergies(
      newAllergies.filter((allergy) => allergy.id !== idToDelete)
    );
  };

  //functie de update pentru pacient
  const handleOnUpdate = async () => {
    //transform doar in value alergia scapam de id
    const rawNewAllergies = newAllergies.map(
      (allergyObject) => allergyObject.value
    );

    const finalNewAllergies = rawNewAllergies.filter(
      (alergy) => alergy && alergy.trim() !== ""
    );

    try {
      const rawResponse = await fetch(
        `http://localhost:5000/doctors/${idDoctor}/patients/${patient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newAlergies: finalNewAllergies }),
        }
      );

      const response = await rawResponse.json();

      if (rawResponse.ok) {
        setAlert({ type: "success", message: "Update succesfuly" });
        setNewAllergies([]);
        update();
      } else {
        setAlert({
          type: response.type,
          message: response.message || "Error on updateing the patient",
        });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Error connecting to the server" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formStyle}>
        <button className={styles.closeStyle} onClick={close}>
          X
        </button>
        <div className={styles.patientDataLable}>
          <p className={styles.patientDataStyle}>Name: {patient.name}</p>
          <p className={styles.patientDataStyle}>CNP: {patient.cnp}</p>
        </div>
        {alert && (
          <p className={`${styles.alertStyle} ${styles[alert.type]}`}>
            {alert.message}
          </p>
        )}
        {newAllergies.map((allergyObject, index) => (
          <div key={allergyObject.id} className={styles.inputLable}>
            <input
              className={styles.inputStyle}
              placeholder={`Allergy ${index + 1}`}
              value={allergyObject.value}
              onChange={(e) =>
                handleAllergiesChange(allergyObject.id, e.target.value)
              }
            />
            <button
              className={styles.deleteStyle}
              onClick={() => handleOnDelete(allergyObject.id)}
            >
              X
            </button>
          </div>
        ))}
        <button className={styles.addStyle} onClick={handleOnAddAlergi}>
          +
        </button>
        <button className={styles.updateStyle} onClick={handleOnUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}
