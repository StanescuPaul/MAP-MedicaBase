import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoutePatient() {
  const isAuthentificated = !!localStorage.getItem("sesionPatientId");

  if (!isAuthentificated) {
    //prin rutele astea protejate nu mai lasam back button o data ce ti ai dat logout
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
