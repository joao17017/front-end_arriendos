import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import './EstudianteDashboard.css';

const AnunciosActivados = () => {
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

        const solicitudesPendientes = response.data.filter(solicitud => solicitud.estado === 'aprobada');
        setSolicitudes(solicitudesPendientes);
      } catch (err) {
        console.error('Error fetching solicitudes de activación:', err);
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/departamentos/${id}`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.Departamento.id_departamento !== id));
    } catch (err) {
      console.error('Error deleting departamento:', err);
    }
  };

  return (
    <div>
      <NavBarArrendador />
      <div className="container mt-4">
        <h1 className="mb-4">Anuncios Activados por Arrendador</h1>
        <div className="row">
          {solicitudes.map(solicitud => (
            <div className="col-md-4 mb-4" key={solicitud.Departamento.id_departamento}>
              <div className="card text-white" style={{ backgroundColor: '#DFB163', border: '2px solid black' }}>
                {solicitud.Departamento.imagen && (
                  <img
                    src={`http://localhost:3000/${solicitud.Departamento.imagen}`}
                    alt={solicitud.Departamento.nombre}
                    className="card-img-top"
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{solicitud.Departamento.nombre}</h5>
                  <p className="card-text">{solicitud.Departamento.descripcion}</p>
                </div>
                <div className="card-footer" style={{ backgroundColor: '#252531' }}>
                  <nav className="nav justify-content-around">
                    <Link
                      to={`/departamentos/editar/${solicitud.Departamento.id_departamento}`}
                      className="nav-link text-white small"
                    >
                      Editar
                    </Link>
                    <Link
                      to="#"
                      className="nav-link text-white small"
                      onClick={() => handleDelete(solicitud.Departamento.id_departamento)}
                    >
                      Eliminar
                    </Link>
                    <Link
                      to={`/departamentos/${solicitud.Departamento.id_departamento}`}
                      className="nav-link text-white small"
                    >
                      Ver
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnunciosActivados;
