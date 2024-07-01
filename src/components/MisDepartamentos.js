// src/components/MisDepartamentos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBarArrendador from './NavBarArrendador';
import { jwtDecode } from "jwt-decode";

const MisDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = '1'; // Suponiendo que el id del arrendador está en el campo `id` del token

        const response = await axios.get(`http://localhost:3000/departamentos/arrendador/${id_arrendador}`);
        setDepartamentos(response.data);
      } catch (err) {
        console.error('Error fetching departamentos:', err);
      }
    };

    fetchDepartamentos();
  }, []);

  return (
    <div>
      <NavBarArrendador />
      <h1>Mis Departamentos</h1>
      <div>
        {departamentos.map(departamento => (
          <div key={departamento.id_departamento}>
            <h2>{departamento.nombre}</h2>
            <p>{departamento.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisDepartamentos;
