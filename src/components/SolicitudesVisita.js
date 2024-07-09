// src/components/SolicitudesVisita.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import NavBarEstudiante from './NavBarEstudiante'; // Cambiar a NavBarEstudiante si es necesario

const SolicitudesVisita = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token); // Decodificar el token para obtener el id del usuario
        const userId = decoded.id;
        

        const response = await axios.get(`http://localhost:3000/solicitudes-visita/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSolicitudes(response.data);
      } catch (err) {
        console.error('Error fetching solicitudes de visita:', err);
      }
    };

    fetchSolicitudes();
  }, []);

  return (
    <div>
      <NavBarEstudiante />
      <h1>Solicitudes de Visita</h1>
      <div>
        {solicitudes.map(solicitud => (
          <div key={solicitud.id_solicitud_visita}>
            <h2>{solicitud.Departamento.nombre}</h2>
            <p>Fecha: {solicitud.fecha_solicitada}</p>
            <p>Comentario: {solicitud.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolicitudesVisita;
