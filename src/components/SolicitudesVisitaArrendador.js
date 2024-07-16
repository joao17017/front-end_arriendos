import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';
import { FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 2rem;
  margin-top: 4rem;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column; /* Por defecto, los elementos estarán en columna */
  padding: 5rem 2rem;
  background-color: #F3F6FF;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row; /* Cambia a fila en pantallas más grandes */
  }
`;

const TextSection = styled.div`
  flex: 2;
  padding-left: 0;
  padding-bottom: 2rem; /* Añadido padding-bottom para separación en vistas pequeñas */

  @media (min-width: 768px) {
    padding-left: 2rem; /* Añadido padding-left para separación en vistas grandes */
    padding-bottom: 0;
  }

  h6 {
    color: #DFB163;
    font-weight: normal;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  h1 {
    margin-bottom: 2rem;
    color: #252531;
  }

  p {
    margin-bottom: 2rem;
    color: #252531;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;

    li {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;

      h5 {
        margin: 0;
        color: #252531;
        span {
          color: #DFB163;
        }
      }

      i {
        color: #DFB163;
        margin-right: 1rem;
      }
    }
  }

  .btn {
    background-color: #007bff;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background-color: #0056b3;
    }

    &.btn-danger {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }
    }

    &.btn-warning {
      background-color: #ffc107;

      &:hover {
        background-color: #e0a800;
      }
    }
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const SolicitudCard = ({ solicitud, onAprobar, onRechazar, onPostergar, onReprogramar, onEliminar, onArrendar }) => {
  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';
  const { DepartamentoActivo: departamento, Usuario: usuario } = solicitud;

  return (
    <SectionContainer>
      <TextSection>
        <h6>Solicitud de Visita</h6>
        <h1>{departamento?.Departamento.nombre}</h1>
        <p>{departamento?.Departamento.descripcion}</p>
        <ul>
          <li>
            <h5><FaAddressCard style={{ color: '#DFB163' }} /> <span>Dirección:</span> {departamento?.Departamento.direccion}</h5>
          </li>
          <li>
            <h5><FaHandHoldingUsd style={{ color: '#DFB163' }} /> <span>Nombre Usuario:</span> {usuario?.nombres}</h5>
          </li>
          <li>
            <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Estado:</span> {solicitud.estado}</h5>
          </li>
          <li>
            <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Fecha Solicitada:</span> {new Date(solicitud.fecha_solicitada).toLocaleDateString()}</h5>
          </li>
          <li>
            <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Comentario Usuario:</span> {solicitud.comentario}</h5>
          </li>
          <li>
            <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Comentario Arrendador:</span> {solicitud.comentario_arrendador}</h5>
          </li>
        </ul>
        <div>
          <button className="btn btn-primary" onClick={() => onAprobar(solicitud.id_solicitud_visita)}>Aprobar</button>
          <button className="btn btn-danger" onClick={() => onRechazar(solicitud.id_solicitud_visita)}>Rechazar</button>
          <button className="btn btn-warning" onClick={() => onPostergar(solicitud.id_solicitud_visita)}>Postergar</button>
          <button className="btn btn-warning" onClick={() => onReprogramar(solicitud.id_solicitud_visita)}>Reprogramar</button>
          <button className="btn btn-secondary" onClick={() => onEliminar(solicitud.id_solicitud_visita)}>Eliminar</button>
          {solicitud.estado === "aprobada" && (
            <button className="btn btn-success" onClick={() => onArrendar(solicitud)}>Arrendar</button>
          )}
        </div>
      </TextSection>
      <ImageSection>
        <img
          src={departamento?.Departamento.imagen ? `http://localhost:3000/${departamento.Departamento.imagen}` : defaultImageUrl}
          alt={departamento?.Departamento.nombre}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImageUrl;
          }}
        />
      </ImageSection>
    </SectionContainer>
  );
};

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

  const handleAprobar = (id) => {
    console.log('Aprobar:', id);
  };

  const handleRechazar = (id) => {
    console.log('Rechazar:', id);
  };

  const handlePostergar = (id) => {
    console.log('Postergar:', id);
  };

  const handleReprogramar = (id) => {
    console.log('Reprogramar:', id);
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

  const handleArrendar = async (solicitud) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/solicitudes-visita/arrendar`, {
        id_departamento_activo: solicitud.id_departamento_activo,
        id_usuario: solicitud.id_usuario,
        id_arrendador: solicitud.id_arrendador,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(solicitudes.filter(sol => sol.id_solicitud_visita !== solicitud.id_solicitud_visita));
      alert('Departamento arrendado con éxito.');
    } catch (err) {
      console.error('Error al arrendar el departamento:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert('Error al arrendar el departamento.');
      }
    }
  };

  return (
    <div>
      <NavBarArrendador />
      <MainContainer>
        {solicitudes.map((solicitud) => (
          <SolicitudCard
            key={solicitud.id_solicitud_visita}
            solicitud={solicitud}
            onAprobar={handleAprobar}
            onRechazar={handleRechazar}
            onPostergar={handlePostergar}
            onReprogramar={handleReprogramar}
            onEliminar={handleEliminar}
            onArrendar={handleArrendar}
          />
        ))}
      </MainContainer>
    </div>
  );
};

export default SolicitudesVisitaArrendador;
