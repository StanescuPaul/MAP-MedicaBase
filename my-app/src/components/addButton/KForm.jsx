import styles from "./KForm.module.css";
import { useEffect, useState } from "react";

export function KForm({ close, idDoctor, onChangeForm }) {
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({
    name: "",
    cnp: "",
    alergies: [],
  });
  const uniqueId = () => Date.now() + Math.random(); //creem un id unic pentru a indentifica in frontend fiecare alergie

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

  function handleOnDelete(idToDelete) {
    //functia asta primeste id ul unei alergi si cand o gaseste in obiectul respectiv sterge alergia prin filter
    setForm((prevForm) => ({
      ...prevForm, //prevForm contine toate datele de dinainte inclusiv numele si cnp dar facem operatii doar pe alergiile acelei persoane prin descompunerea obiectului
      alergies: prevForm.alergies.filter(
        (allergy) => allergy.id !== idToDelete
      ), //filtrez array-ul pentru a sterge daca nu e nevoie de un input
    }));
  }

  const handleOnAddAlergi = () => {
    //functia asta da handle la butonul de add care adauga inputuri si cand le adauga seteaza alergia pentru inputul respectiv ca fiind un string gol pentru a nu avea erori
    if (form.alergies.length < 8) {
      //se foloseste prevForm in fiecare pentru ca ai nevoie de starea anterioara a form-ului pentru a adauga o noua alergie dupa ce aexistenta adica trebuie sa o stii pe cea initiala pentru a o adauga pe urmatoarea cand vien vorba de array-uri
      setForm((prevForm) => ({
        ...prevForm, //prevForm contine toate datele de dinainte inclusiv numele si cnp dar facem operatii doar pe alergiile acelei persoane prin descompunerea obiectului
        alergies: [...prevForm.alergies, { id: uniqueId(), value: "" }], //aici transformam allergile intr-un obiect cu id si ii adaugam valoarea unui string gol pe inputul respectiv
      }));
      setAlert(null);
    } else {
      setAlert({
        type: "error",
        message: "Ati atins numarul maxim de alergii",
      });
    }
  };

  const handleAllergiChange = (idToUpdate, value) => {
    //functia asta cauta in alergi si cand o gaseste ii seteaza valoarea la cea dorita din input
    setForm((prevForm) => ({
      //prevForm contine toate datele de dinainte inclusiv numele si cnp dar facem operatii doar pe alergiile acelei persoane prin descompunerea obiectului
      ...prevForm,
      alergies: prevForm.alergies.map((allergy) =>
        allergy.id === idToUpdate ? { ...allergy, value: value } : allergy
      ), //aici luam prevForm il descompunem si cautam prin alergile vechi care alergie are id === cu idToUpdate daca il gasim ii modificam valoare cu ce avem in input pentru ca el e creat ca gol la inceput si daca nu il gasim returnam alergia neatinsa
    }));
  };

  const handleOnAddPatient = async () => {
    const rawAllergies = form.alergies.map(
      (allergyObject) => allergyObject.value
    ); //aici mapam prin alergii si transformam alergiaOvject care are si id in alergia array care are doar string adica value

    const finalAllergies = rawAllergies.filter(
      (allergy) => allergy && allergy.trim() !== ""
    ); //aici filtram sa nu bagam in db si campurile "" sau undefined sau null(value&&) apoi trecem la taierea spatiilor goale daca exista dupa sau inaintea string-ului

    const finalForm = {
      name: form.name,
      cnp: form.cnp,
      alergies: finalAllergies,
    };

    try {
      const rawResponse = await fetch(
        `http://localhost:5000/doctors/${idDoctor}/patients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalForm),
        }
      );

      const data = await rawResponse.json();

      if (rawResponse.ok) {
        setAlert({ type: data.type, message: "Pacient adaugat cu succes" });
        setForm({
          name: "",
          cnp: "",
          alergies: [],
        });
        onChangeForm();
      } else {
        setAlert({
          type: data.type,
          message: data.message || "Eroare la adaugarea pacientului",
        });
        setForm({
          ...form, //setam asa pentru ca daca am pune doar cnp: "" schimbam toata forma obiectului form setam name: undefined in loc de "" si allergies la fel
          cnp: "",
        });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Eroare la conectarea la server" });
      setForm({
        ...form,
        cnp: "",
      });
    }
  };

  return (
    <div className={styles.fundalStyle}>
      <div className={styles.formStyle}>
        <button className={styles.backStyle} onClick={close}>
          {" "}
          {/* prin intermediul props-ului trimitem functia prin care setam false la setIsFormOpen si se inchide formul */}
          X
        </button>
        {alert && (
          <p className={`${styles.alertStyle} ${styles[alert.type]}`}>
            {alert.message}
          </p>
        )}
        <input
          className={styles.inputStyle}
          placeholder="Nume"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={styles.inputStyle}
          placeholder="CNP"
          value={form.cnp}
          onChange={(e) => setForm({ ...form, cnp: e.target.value })}
        />
        {form.alergies.map(
          (
            allergyObject,
            index //index e creat de map si allergyObject este allergies: {} facut in handleAdd o singura alergie din acel array
          ) => (
            <div key={allergyObject.id} className={styles.inpAllergiLable}>
              <input
                className={styles.inputStyle}
                placeholder={`Alergia ${index + 1}`}
                value={allergyObject.value} //avem obiectul allergyObject cu id si
                onChange={(e) =>
                  handleAllergiChange(allergyObject.id, e.target.value)
                } // folosim functia pentru a trimite alergiile
              />
              <button
                type="button"
                className={styles.deleteStyle}
                onClick={() => handleOnDelete(allergyObject.id)} // daca am doar handleOnDelete se apeleaza incontinu nu doar la click
              >
                X
              </button>
            </div>
          )
        )}
        <div className={styles.btnLable}>
          <button className={styles.addInpStyle} onClick={handleOnAddAlergi}>
            {/*aici se creaza noile inputuri si se face obiectul allergyObject pe care il ia map-ul de sus*/}
            ADD Allergi
          </button>
          <button
            className={styles.addPatientStyle}
            onClick={handleOnAddPatient}
          >
            ADD Patient
          </button>
        </div>
      </div>
    </div>
  );
}
