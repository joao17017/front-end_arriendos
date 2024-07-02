// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import TestAxios from "./components/TestAxios";
import Arrendatarios from "./components/Arrendatarios";
import Login from "./components/Login";
import DepartamentoDetalles from "./components/DepartamentoDetalles";
import EstudianteDashboard from "./components/EstudianteDashboard";
import AdministradorDashboard from "./components/AdministradorDashboard";
import ArrendadorDashboard from "./components/ArrendadorDashboard";
import AnunciosPorActivar from "./components/AnunciosPorActivar";
import MisDepartamentos from "./components/MisDepartamentos";
import AnunciosActivados from "./components/AnunciosActivados";
import SolicitudesVisita from "./components/SolicitudesVisita";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import EditarDepartamento from "./components/EditarDepartamento";
import ArrendadorProfile from './components/ArrendadorProfile';
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
          <Route
            path="/arrendador/anuncios-por-activar"
            element={<AnunciosPorActivar />}
          />
          <Route
            path="/arrendador/mis-departamentos"
            element={<MisDepartamentos />}
          />
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
              //<PrivateRoute allowedRoles={["administrador"]}>
                <AdministradorDashboard />
              //</PrivateRoute>
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
          <Route
            path="/arrendador/perfil"
            element={
              <PrivateRoute allowedRoles={["arrendador"]}>
                <ArrendadorProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/departamentos/:id"
            element={
              <PrivateRoute allowedRoles={["estudiante"]}>
                <DepartamentoDetalles />
              </PrivateRoute>
            }
          />
          <Route
            path="/departamentos/editar/:id_departamento"
            element={
              <PrivateRoute allowedRoles={["arrendador"]}>
                <EditarDepartamento />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
