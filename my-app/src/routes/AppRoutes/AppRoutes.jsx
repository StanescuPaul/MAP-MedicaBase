import { Routes, Route } from "react-router-dom";
import { Login } from "../Login/Login";
import { Home } from "../Home/Home";
import { Register } from "../Register/Register";
import { DoctorPatients } from "../DoctorPatients/DoctorPatients";
import { DoctorPatient } from "../DoctorPatientRoute/DoctorPatient";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors/login" element={<Login />} />
      <Route path="/doctors/register" element={<Register />} />
      <Route path="/doctors/:idDoctor/patients" element={<DoctorPatients />} />
      {/* ruta e cu :idDoctors dar url-ul contine parametrul din login*/}
      <Route
        path="/doctors/:idDoctor/patients/:idPatient"
        element={<DoctorPatient />}
      />
    </Routes>
  );
}
