// src/components/ListaSolicitudesVisita.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarEstudiante from './NavBarEstudiante';
import {jwtDecode} from 'jwt-decode';
import './ListaSolicitudesVisita.css';

const ListaSolicitudesVisita = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

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
        setUsuario(decoded);

        const response = await axios.get(`http://localhost:3000/solicitudes-visita/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSolicitudes(response.data);
      } catch (err) {
        console.error('Error fetching solicitudes de visita:', err);
        setError('Error al obtener las solicitudes de visita');
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!solicitudes.length) {
    return <p>No hay solicitudes de visita</p>;
  }

  return (
    <div>
      <NavBarEstudiante />
      <div className="lista-solicitudes-container">
        <h1>Mis Solicitudes de Visita</h1>
        <div className="solicitudes-list">
          {solicitudes.map(solicitud => (
            <div className="solicitud-card" key={solicitud.id_solicitud_visita}>
              {solicitud.Departamento ? (
                <>
                  <h3>{solicitud.Departamento.nombre}</h3>
                  <p><strong>Dirección:</strong> {solicitud.Departamento.direccion}</p>
                  <p><strong>Fecha Solicitada:</strong> {new Date(solicitud.fecha_solicitada).toLocaleDateString()}</p>
                  <p><strong>Estado:</strong> {solicitud.estado}</p>
                  <p><strong>Comentario:</strong> {solicitud.comentario}</p>
                  {solicitud.Departamento.imagen && (
                    <img
                      src={`http://localhost:3000/${solicitud.Departamento.imagen}`}
                      alt={solicitud.Departamento.nombre}
                      className="solicitud-image"
                    />
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

export default ListaSolicitudesVisita;
