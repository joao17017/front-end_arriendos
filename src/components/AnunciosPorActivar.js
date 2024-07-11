import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import { jwtDecode } from 'jwt-decode';
import './MisDepartamentos.css';
import './AnunciosPorActivar.css';
import { FaInfoCircle } from 'react-icons/fa';


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
            Authorization: `Bearer ${token}`,
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
      <div className="container mt-4">
        <h1 className="mb-4">Anuncios por Activar de Arrendador</h1>
        <div className="row mx-1 portfolio-container">
          {solicitudes.map(solicitud => (
            <div className="col-lg-4 col-md-6 col-sm-12 p-0 portfolio-item" key={solicitud.id_solicitud}>
              <div className="position-relative overflow-hidden">
                <div className="portfolio-img d-flex align-items-center justify-content-center">
                  <img
                    src={solicitud.Departamento && solicitud.Departamento.imagen ? `http://localhost:3000/${solicitud.Departamento.imagen}` : "/images/default-image.png"}
                    alt={solicitud.Departamento ? solicitud.Departamento.nombre : 'Imagen no disponible'}
                    className="img-fluid"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <div className="portfolio-text bg-secondary d-flex flex-column align-items-center justify-content-center">
                  <h4 className="text-white mb-4">{solicitud.Departamento ? solicitud.Departamento.nombre : 'Departamento no encontrado'}</h4>
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="estado-texto">
                      <FaInfoCircle className="estado-icono" /> {solicitud.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnunciosPorActivar;
