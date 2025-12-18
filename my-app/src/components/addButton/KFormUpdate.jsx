import styles from "./KFormUpdate.module.css";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";

export function KFormUpdate({ close, patient, idDoctor, update }) {
  const uniqueId = () => Date.now() + Math.random();
  const [newData, setNewData] = useState({
    newName: patient.name,
    newCnp: patient.cnp,
    newAllergies: [],
  });
  //alergii noi
  const [newAllergies, setNewAllergies] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCnp, setIsEditingCnp] = useState(false);

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

  //functie pentru editare nume si cnp
  const handleOnEditingName = () => {
    setIsEditingName(true);
  };
  const handleOnSaveName = () => {
    setIsEditingName(false);
  };
  const handleOnEditingCnp = () => {
    setIsEditingCnp(true);
  };
  const handleOnSaveCnp = () => {
    if (newData.newCnp.length !== 13) {
      setAlert({ type: "error", message: "CNP must have 13 characters" });
      return;
    }
    setIsEditingCnp(false);
  };

  //functie de update pentru pacient
  const handleOnUpdate = async () => {
    //transform doar in value alergia scapam de id
    const rawNewAllergies = newAllergies.map(
      (allergyObject) => allergyObject.value
    );

    const finalNewAllergies = rawNewAllergies.filter(
      (alergy) => alergy && alergy.trim() !== "" // verificam daca exista alergia sau e input gol si daca are spatii la inceput sau final
    );

    if (
      newData.newName === patient.name &&
      newData.newCnp === patient.cnp &&
      finalNewAllergies.length === 0
    ) {
      setAlert({ type: "error", message: "There is no update" }); //handle in caz ca nu sunt introduse schimbari
      return;
    }

    const finalForm = {
      newName: newData.newName,
      newCnp: newData.newCnp,
      newAlergies: finalNewAllergies,
    };

    try {
      const rawResponse = await fetch(
        `${API_URL}/api/doctors/${idDoctor}/patients/${patient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalForm),
        }
      );

      const response = await rawResponse.json();

      if (rawResponse.ok) {
        setAlert({ type: "success", message: "Update succesfully" });
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
        {alert && (
          <p className={`${styles.alertStyle} ${styles[alert.type]}`}>
            {alert.message}
          </p>
        )}
        <div className={styles.patientDataLable}>
          {isEditingName ? (
            <div className={styles.changeLable}>
              <input
                className={styles.inputSaveStyle}
                placeholder="Name"
                value={newData.newName}
                onChange={(e) =>
                  setNewData({ ...newData, newName: e.target.value })
                }
              />
              <button className={styles.changeStyle} onClick={handleOnSaveName}>
                Save
              </button>
            </div>
          ) : (
            <div className={styles.changeLable}>
              <p className={styles.patientDataStyle}>Name: {newData.newName}</p>
              <button
                className={styles.changeStyle}
                onClick={handleOnEditingName}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        {isEditingCnp ? (
          <div className={styles.changeLable}>
            <input
              className={styles.inputSaveStyle}
              placeholder="CNP"
              value={newData.newCnp}
              onChange={(e) =>
                setNewData({ ...newData, newCnp: e.target.value })
              }
            />
            <button className={styles.changeStyle} onClick={handleOnSaveCnp}>
              Save
            </button>
          </div>
        ) : (
          <div className={styles.changeLable}>
            <p className={styles.patientDataStyle}>CNP: {newData.newCnp}</p>
            <button className={styles.changeStyle} onClick={handleOnEditingCnp}>
              Edit
            </button>
          </div>
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
