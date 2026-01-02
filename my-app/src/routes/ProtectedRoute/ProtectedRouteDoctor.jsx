import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRouteDoctor() {
  const isAuthentificated = !!localStorage.getItem("token"); //dubla negatie converteste orice tip de date in valoarea lui booleana
  //sesionDcotorId vine din login

  if (!isAuthentificated) {
    return (
      <Navigate to="/" replace /> //daca nu e autentificat si da back iti da return pe ruta /
      //replace sterge pagina protejata din istoric practic o inlocuieste pe ceea precedenta cu ceea actuala
    );
  }

  return <Outlet />; //daca esti logat automat outlet o sa se schimbe cu elementul din ruta copil a protectedRoute
}
