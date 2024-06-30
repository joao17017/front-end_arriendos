// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import TestAxios from "./components/TestAxios";
import Arrendatarios from "./components/Arrendatarios";
import Departamentos from "./components/Departamento";
import EstudianteDashboard from "./components/EstudianteDashboard";
import AdministradorDashboard from "./components/AdministradorDashboard";
import ArrendadorDashboard from "./components/ArrendadorDashboard";
import DepartamentoDetalles from "./components/DepartamentoDetalles";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test-axios" element={<TestAxios />} />
          <Route path="/arrendatarios" element={<Arrendatarios />} />
          <Route path="/departamentos" element={<Departamentos />} />
          <Route
            path="/estudiante/dashboard"
            element={
              <PrivateRoute allowedRoles={["estudiante"]}>
                <EstudianteDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/administrador/dashboard"
            element={
              <PrivateRoute allowedRoles={["administrador"]}>
                <AdministradorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/arrendador/dashboard"
            element={
              <PrivateRoute allowedRoles={["arrendador"]}>
                <ArrendadorDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/departamentos/:id" element={<PrivateRoute allowedRoles={["estudiante"]}><DepartamentoDetalles /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
