// src/components/AnunciosPorActivar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import { jwtDecode } from 'jwt-decode';
import './EstudianteDashboard.css';

const AnunciosPorActivar = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(`http://localhost:3000/solicitudes-activacion/arrendador/${id_arrendador}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Corrección del encabezado de autorización
          },
        });

        const solicitudesPendientes = response.data.filter(solicitud => solicitud.estado !== 'aprobada');
        setSolicitudes(solicitudesPendientes);
      } catch (err) {
        console.error('Error fetching solicitudes de activación:', err);
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  return (
    <div>
      <NavBarArrendador />
      <div className="dashboard">
        <h1>Anuncios por Activar de Arrendador</h1>
        <p>Bienvenido a tu listado de departamentos por activarse.</p>
        <div className="cards-container">
          {solicitudes.map(solicitud => (
            <div className="card" key={solicitud.id_solicitud}>
              {solicitud.Departamento ? (
                <>
                  <h3>{solicitud.Departamento.nombre}</h3>
                  <p>{solicitud.Departamento.descripcion}</p>
                  <p><strong>Estado:</strong> {solicitud.estado}</p>
                  {solicitud.Departamento.imagen && (
                    <img src={`http://localhost:3000/${solicitud.Departamento.imagen}`} alt={solicitud.Departamento.nombre} className="card-image" />
                  )}
                </>
              ) : (
                <p>Departamento no encontrado</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnunciosPorActivar;
