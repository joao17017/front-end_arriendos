// src/components/DepartamentosArrendados.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NavBarArrendador from "./NavBarArrendador";


const DepartamentosArrendados = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/");
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(
          `http://localhost:3000/departamentos-arrendados/lista/${id_arrendador}`,
          {id_arrendador},{
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );

        setDepartamentos(response.data);
      } catch (err) {
        console.error("Error fetching departamentos arrendados:", err);
      }
    };

    fetchDepartamentos();
  }, [navigate]);

  return (
    <div>
      <NavBarArrendador />
      <div className="dashboard">
        <h1>Departamentos Arrendados</h1>
        <div className="cards-container">
          {departamentos.map((departamento) => (
            <div className="card" key={departamento.id_departamento}>
              <h3>Departamento ID: {departamento.id_departamento}</h3>
              <p><strong>Usuario ID:</strong> {departamento.id_usuario}</p>
              <p><strong>Arrendador ID:</strong> {departamento.id_arrendador}</p>
              <p><strong>Descripción:</strong> {departamento.Departamento.descripcion}</p>
              <p><strong>Descripción:</strong> {departamento.Departamento.descripcion}</p>
              <p><strong>Dirección:</strong> {departamento.Departamento.direccion}</p>
              <p><strong>Arrendado a:</strong> {departamento.Usuario.nombres}</p>
              {departamento.Departamento.imagen && (
                <img
                  src={`http://localhost:3000/${departamento.Departamento.imagen}`}
                  alt={departamento.Departamento.nombre}
                  className="card-image"
                />
              )}
              <p><strong>Arrendado por:</strong> {departamento.Arrendador.nombres}</p>
              
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartamentosArrendados;