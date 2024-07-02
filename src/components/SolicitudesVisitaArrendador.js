import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import {jwtDecode} from 'jwt-decode';
import './SolicitudesVisitaArrendador.css';

const SolicitudesVisitaArrendador = () => {
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

        const response = await axios.get(`http://localhost:3000/solicitudes-visita/arrendador/${id_arrendador}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSolicitudes(response.data);
      } catch (err) {
        console.error('Error fetching solicitudes de visita:', err);
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  const handleAprobar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/solicitudes-visita/${id}/aprobar`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(solicitudes.map(solicitud => 
        solicitud.id_solicitud_visita === id ? { ...solicitud, estado: 'aprobada' } : solicitud
      ));
    } catch (err) {
      console.error('Error al aprobar la solicitud de visita:', err);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/solicitudes-visita/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud_visita !== id));
    } catch (err) {
      console.error('Error al eliminar la solicitud de visita:', err);
    }
  };

  const handleRechazar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/solicitudes-visita/${id}/rechazar`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(solicitudes.map(solicitud => 
        solicitud.id_solicitud_visita === id ? { ...solicitud, estado: 'rechazada' } : solicitud
      ));
    } catch (err) {
      console.error('Error al rechazar la solicitud de visita:', err);
    }
  };

  const handlePostergar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/solicitudes-visita/${id}/postergar`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(solicitudes.map(solicitud => 
        solicitud.id_solicitud_visita === id ? { ...solicitud, estado: 'postergada' } : solicitud
      ));
    } catch (err) {
      console.error('Error al postergar la solicitud de visita:', err);
    }
  };

  const handleReprogramar = async (id, nuevaFecha) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/solicitudes-visita/${id}/reprogramar`, { fecha_solicitada: nuevaFecha }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(solicitudes.map(solicitud => 
        solicitud.id_solicitud_visita === id ? { ...solicitud, fecha_solicitada: nuevaFecha } : solicitud
      ));
    } catch (err) {
      console.error('Error al reprogramar la solicitud de visita:', err);
    }
  };

  return (
    <div>
      <NavBarArrendador />
      <div className="dashboard">
        <h1>Solicitudes de Visita Recibidas</h1>
        <p>Estas son las solicitudes de visita que has recibido para tus departamentos.</p>
        <div className="cards-container">
          {solicitudes.map(solicitud => (
            <div className={`card ${solicitud.estado === 'aprobada' ? 'aprobada' : ''}`} key={solicitud.id_solicitud_visita}>
              {solicitud.Departamento ? (
                <>
                  <h3>{solicitud.Departamento.nombre}</h3>
                  <p>{solicitud.Departamento.descripcion}</p>
                  <p><strong>Estado:</strong> {solicitud.estado}</p>
                  <p><strong>Fecha Solicitada:</strong> {new Date(solicitud.fecha_solicitada).toLocaleDateString()}</p>
                  <p><strong>Comentario:</strong> {solicitud.comentario}</p>
                  {solicitud.Departamento.imagen && (
                    <img src={`http://localhost:3000/${solicitud.Departamento.imagen}`} alt={solicitud.Departamento.nombre} className="card-image" />
                  )}
                  {solicitud.estado === 'pendiente' && (
                    <>
                      <button onClick={() => handleAprobar(solicitud.id_solicitud_visita)} className="button aprobar-button">
                        Aprobar Solicitud
                      </button>
                      <button onClick={() => handleReprogramar(solicitud.id_solicitud_visita, prompt("Ingrese la nueva fecha de visita"))} className="button reprogramar-button">
                        Reprogramar Solicitud
                      </button>
                      <button onClick={() => handlePostergar(solicitud.id_solicitud_visita)} className="button postergar-button">
                        Postergar Solicitud
                      </button>
                      <button onClick={() => handleRechazar(solicitud.id_solicitud_visita)} className="button rechazar-button">
                        Rechazar Solicitud
                      </button>
                      <button onClick={() => handleEliminar(solicitud.id_solicitud_visita)} className="button eliminar-button">
                        Eliminar Solicitud
                      </button>
                    </>
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

export default SolicitudesVisitaArrendador;
