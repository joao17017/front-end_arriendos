// src/components/SolicitudesVisita.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBarArrendador from './NavBarArrendador';

const SolicitudesVisita = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/solicitudes-visita');
        setSolicitudes(response.data);
      } catch (err) {
        console.error('Error fetching solicitudes de visita:', err);
      }
    };

    fetchSolicitudes();
  }, []);

  return (
    <div>
      <NavBarArrendador />
      <h1>Solicitudes de Visita</h1>
      <div>
        {solicitudes.map(solicitud => (
          <div key={solicitud.id}>
            <h2>{solicitud.nombre}</h2>
            <p>{solicitud.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolicitudesVisita;
