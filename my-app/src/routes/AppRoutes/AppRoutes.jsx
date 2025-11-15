import { Routes, Route } from "react-router-dom";
import { Login } from "../Login/Login";
import { Home } from "../Home/Home";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors/login" element={<Login />} />
    </Routes>
  );
}
