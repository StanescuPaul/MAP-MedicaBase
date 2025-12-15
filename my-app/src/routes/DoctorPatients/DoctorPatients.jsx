import { useParams } from "react-router-dom";
import { KDoctor } from "../../components/doctorCard/KDoctor";
import { useState, useEffect } from "react";
import { KPatient } from "../../components/patientCard/KPatient";
import { KForm } from "../../components/addButton/KForm";
import { useNavigate } from "react-router-dom";
import styles from "./DoctorPatients.module.css";

export function DoctorPatients() {
  const { idDoctor } = useParams(); //luam din url id-ul doctorului
  const [doctorData, setDoctorData] = useState({
    name: "",
    imgUrl: "",
  });
  const [patientsData, setPatientsData] = useState([]); //array gol cu toti pacientii
  const [cnp, setCnp] = useState("");
  const [allert, setAllert] = useState(null);
  const [visible, setVisible] = useState("Visible"); //pentru a seta vizibilitatea butonului de add
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPatientsData = async () => {
    //functia este creata pentru a putea trimite functia ca prop la KForm ca la finalul adaugarii unui pacient in form sa faca o rerandare a listei de pacienti pentru a se actualiza lista in timp real
    try {
      const rawPatientsData = await fetch(
        `http://localhost:5000/api/doctors/${idDoctor}/patients`
      );

      const patientsInfo = await rawPatientsData.json();
      setPatientsData(patientsInfo.data);
    } catch (err) {
      setAllert("Error rendering the patients");
    }
  };

  useEffect(() => {
    const dataDoctor = async () => {
      try {
        const responseDoctorData = await fetch(
          //pentru await trebuie sa fiu intr-un async function
          `http://localhost:5000/api/doctors/${idDoctor}`
        );

        const dataDoctor = await responseDoctorData.json();

        setDoctorData({
          name: dataDoctor.data.name,
          imgUrl: dataDoctor.data.profileImgUrl,
        }); //datele schima doctorName

        const responsePatientsData = await fetch(
          `http://localhost:5000/api/doctors/${idDoctor}/patients`
        );
        const dataPatients = await responsePatientsData.json();

        setPatientsData(dataPatients.data); //datapatients.data pentru ca acela e obiectul din sendSucces din helper care contine toti pacientii
      } catch (error) {
        console.log("Nu s-a gasit numele in server!!!");
      }
    };
    dataDoctor(); //apelam functia pentru a prelua datele
  }, [idDoctor]); //luam datele din fetch de fiecare data cand se schimba id-ul doctorului

  const handleOnFind = async () => {
    //cand se apasa butonul se executa query params cauta si daca este gol inputul returneaza lista initiala
    try {
      if (cnp.length === 13 || cnp === "") {
        //in cazul in care cnp are numarul bun de cifre afisam datele sau daca este 0 afisam toata lista daca nu dam eroarea
        const rawResponse = await fetch(
          `http://localhost:5000/api/doctors/${idDoctor}/patients?cnp=${cnp}`
          //query params nu trebuie introdusi si in backend rout pentru ca sunt operatii facute pe anumite date din backend dar params urile normale definite cu :idCeva trebuie pentru ca acestia dau ierarhia si de unde se iau ce date
        );

        const dataPatient = await rawResponse.json();

        if (rawResponse.ok) {
          setPatientsData(dataPatient.data);
          setAllert(null);
          setCnp("");
        } else {
          setAllert(dataPatient.message || "Unknown error");
          setCnp("");
        }
        if (cnp.length === 13) {
          //ascundem butonul de add daca suntem intr-un find
          setVisible("Hidden");
        } else if (cnp === "") {
          setVisible("Visible");
        }
      } else {
        setAllert("The CNP must contain 13 digits");
        setCnp("");
      }
    } catch (err) {
      setAllert("Eroare la conectarea la server");
      setCnp("");
    }
  };

  function handleOnAdd() {
    setIsFormOpen(true);
  }
  function handleCloseForm() {
    setIsFormOpen(false);
  }

  function handleOnKPatient(patientData) {
    navigate(`/doctors/${idDoctor}/patients/${patientData.id}`);
  }

  function handleOnKDoctor() {
    navigate(`/doctors/${idDoctor}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.kdoctorLable}>
        <h1 className={styles.textStyle}>MedicaBase</h1>
        <h2 className={styles.textStyle}>User</h2>
        <KDoctor
          name={doctorData.name}
          imgUrl={doctorData.imgUrl}
          onClick={handleOnKDoctor}
        />
      </div>
      <div className={styles.continutDreapta}>
        {isFormOpen && (
          <KForm
            close={handleCloseForm}
            idDoctor={idDoctor}
            onChangeForm={fetchPatientsData}
          />
        )}
        <div className={styles.inputLable}>
          <input
            className={styles.inputStyle}
            placeholder="Enter CNP"
            value={cnp}
            onChange={(e) => setCnp(e.target.value)}
          />
          <button className={styles.inpBtnStyle} onClick={handleOnFind}>
            FIND
          </button>
        </div>
        <div className={styles.allertLable}>
          <p className={styles.allertStyle}>{allert}</p>
        </div>
        <div className={styles.kpatientsLable}>
          <button
            className={`${styles.addBtnStyle} ${styles[visible]}`}
            onClick={handleOnAdd} // daca dau click trecem pe true si afisam formularul
          >
            {/*pentru a avea butonul de add doar in lista completa*/}
            <img
              className={styles.addImgStyle}
              src={require("../../assets/addBtn.png")}
              alt="add patient"
            />
            <h1 className={styles.textAddStyle}>Add patient</h1>
          </button>
          {patientsData.map((patientData, index) => (
            <KPatient
              key={patientData.id}
              onClick={() => handleOnKPatient(patientData)} //pentru a nu se apela la randarea cardului doar la onClick
              name={patientData.name}
              cnp={patientData.cnp}
              number={index + 1} // index da numarul de mapari realizate e mai eficient decat o variabila let
              // createdAt={new Date(patientData.createAt).toLocaleDateString(
              //   "ro-RO" //convetrim datele pentru a avea doar luna anul si ziua
              // )}
              // updatedAt={new Date(patientData.updateAt).toLocaleDateString(
              //   "ro-RO" //convetrim datele pentru a avea doar luna anul si ziua
              // )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
