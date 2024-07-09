import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NavBarArrendador from "./NavBarArrendador";
import "./DepartamentosArrendados.css"; // Asegúrate de tener un archivo CSS

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
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setDepartamentos(response.data);
      } catch (err) {
        console.error("Error fetching departamentos arrendados:", err);
      }
    };

    fetchDepartamentos();
  }, [navigate]);

  const handleComentar = (id_departamento) => {
    // Implementar lógica para comentar
    console.log("Comentar:", id_departamento);
  };

  const handleEliminar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/departamentos-arrendados/${id_departamento_arrendado}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log("Departamento eliminado:", id_departamento_arrendado);
    } catch (err) {
      console.error("Error eliminando departamento arrendado:", err);
    }
  };

  const handleDesocupar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/departamentos-arrendados/desocupar/${id_departamento_arrendado}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log("Departamento desocupado:", id_departamento_arrendado);
    } catch (err) {
      console.error("Error desocupando departamento arrendado:", err);
    }
  };

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
              <button className="button comentar-button" onClick={() => handleComentar(departamento.id_departamento)}>
                Comentar
              </button>
              <button className="button eliminar-button" onClick={() => handleEliminar(departamento.id_DepartamentoArrendado)}>
                Eliminar
              </button>
              <button className="button desocupar-button" onClick={() => handleDesocupar(departamento.id_DepartamentoArrendado)}>
                Desocupar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartamentosArrendados;
