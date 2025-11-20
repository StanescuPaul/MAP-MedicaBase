import { Routes, Route } from "react-router-dom";
import { Login } from "../Login/Login";
import { Home } from "../Home/Home";
import { Register } from "../Register/Register";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={ <Home /> } />
      <Route path="/doctors/login" element={ <Login /> } />
      <Route path="/doctors/register" element={ <Register/> } />
    </Routes>
  );
}
