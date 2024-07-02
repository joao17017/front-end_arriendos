// src/components/AdminSolicitudesActivacion.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBarAdministrador from './NavBarAdministrador';
import './AdminSolicitudesActivacion.css';

const AdminSolicitudesActivacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/solicitudes-activacion');
        setSolicitudes(response.data);
      } catch (err) {
        setError('Error al obtener las solicitudes de activación');
        console.error(err);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleAprobar = async (id_solicitud) => {
    try {
      await axios.put(`http://localhost:3000/solicitudes-activacion/${id_solicitud}/aprobar`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud !== id_solicitud));
      alert('Solicitud aprobada');
    } catch (err) {
      console.error('Error al aprobar solicitud:', err);
    }
  };

  const handleEliminar = async (id_solicitud) => {
    try {
      await axios.delete(`http://localhost:3000/solicitudes-activacion/${id_solicitud}`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud !== id_solicitud));
      alert('Solicitud eliminada');
    } catch (err) {
      console.error('Error al eliminar solicitud:', err);
    }
  };

  const handleDesaprobar = async (id_solicitud) => {
    try {
      await axios.put(`http://localhost:3000/solicitudes-activacion/${id_solicitud}/desaprobar`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud !== id_solicitud));
      alert('Solicitud desaprobada');
    } catch (err) {
      console.error('Error al desaprobar solicitud:', err);
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <NavBarAdministrador />
      <div className="container">
        <h1>Administrar Solicitudes de Activación</h1>
        {solicitudes.length === 0 ? (
          <p>No hay solicitudes de activación</p>
        ) : (
          <div className="solicitudes-grid">
            {solicitudes.map(solicitud => (
              <div className="solicitud-card" key={solicitud.id_solicitud}>
                <p><strong>ID Solicitud:</strong> {solicitud.id_solicitud}</p>
                <p><strong>ID Departamento:</strong> {solicitud.id_departamento}</p>
                <p><strong>ID Arrendador:</strong> {solicitud.id_arrendador}</p>
                <p><strong>Comentario:</strong> {solicitud.comentario}</p>
                <div className="solicitud-buttons">
                  <button onClick={() => handleAprobar(solicitud.id_solicitud)} className="button button-approve">Aprobar</button>
                  <button onClick={() => handleEliminar(solicitud.id_solicitud)} className="button button-delete">Eliminar</button>
                  <button onClick={() => handleDesaprobar(solicitud.id_solicitud)} className="button button-disapprove">Desaprobar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSolicitudesActivacion;
