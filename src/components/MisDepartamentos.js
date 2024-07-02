import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBarArrendador from './NavBarArrendador';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './MisDepartamentos.css';

const MisDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(`http://localhost:3000/departamentos/arrendador/${id_arrendador}`);
        setDepartamentos(response.data);
      } catch (err) {
        console.error('Error fetching departamentos:', err);
      }
    };

    fetchDepartamentos();
  }, []);

  const handleEdit = (id) => {
    navigate(`/departamentos/editar/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/departamentos/${id}`);
      setDepartamentos(departamentos.filter(depto => depto.id_departamento !== id));
    } catch (err) {
      console.error('Error deleting departamento:', err);
    }
  };

  const handleSolicitarActivacion = (id) => {
    console.log(`Solicitar activación para el departamento ${id}`);
  };

  return (
    <div>
      <NavBarArrendador />
      <div className="container">
        <h1>Mis Departamentos</h1>
        <div className="departamentos-grid">
          {departamentos.map(departamento => (
            <div className="departamento-card" key={departamento.id_departamento}>
              <img
                src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : '/images/default-image.png'}
                alt={departamento.nombre}
                className="departamento-image"
              />
              <div className="departamento-details">
                <h2>{departamento.nombre}</h2>
                <p>{departamento.descripcion}</p>
                <div className="departamento-buttons">
                  <button onClick={() => handleDelete(departamento.id_departamento)} className="button button-delete">Eliminar</button>
                  <button onClick={() => handleEdit(departamento.id_departamento)} className="button button-edit">Editar</button>
                  <button onClick={() => handleSolicitarActivacion(departamento.id_departamento)} className="button button-activate">Solicitar Activación</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MisDepartamentos;
