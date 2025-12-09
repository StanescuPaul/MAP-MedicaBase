import { Routes, Route } from "react-router-dom";
import { DoctorLogin } from "../DoctorLogin/DoctorLogin";
import { Home } from "../Home/Home";
import { DoctorRegister } from "../DoctorRegister/DoctorRegister";
import { DoctorPatients } from "../DoctorPatients/DoctorPatients";
import { DoctorPatient } from "../DoctorPatient/DoctorPatient";
import { KDoctorProfile } from "../DoctorProfile/DoctorProfile";
import { PatientLogin } from "../PatientLogin/PatientLogin";
import { PatientProfile } from "../PatientProfile/PatientProfile";
import { ProtectedRouteDoctor } from "../ProtectedRoute/ProtectedRouteDoctor";
import { ProtectedRoutePatient } from "../ProtectedRoute/ProtectedRoutePatient";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors/login" element={<DoctorLogin />} />
      <Route path="/doctors/register" element={<DoctorRegister />} />
      <Route element={<ProtectedRouteDoctor />}>
        <Route
          path="/doctors/:idDoctor/patients"
          element={<DoctorPatients />}
        />
        {/* ruta e cu :idDoctors dar url-ul contine parametrul din login*/}
        <Route
          path="/doctors/:idDoctor/patients/:idPatient"
          element={<DoctorPatient />}
        />
        <Route path="/doctors/:idDoctor" element={<KDoctorProfile />} />
      </Route>
      <Route path="/patients/login" element={<PatientLogin />} />
      <Route element={<ProtectedRoutePatient />}>
        <Route path="patients/:idPatient" element={<PatientProfile />} />
      </Route>
    </Routes>
  );
}
