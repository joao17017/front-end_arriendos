import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import NavBarEstudiante from './NavBarEstudiante';
import styled from 'styled-components';
import { FaAddressCard, FaCalendarAlt, FaComments } from 'react-icons/fa';

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 2rem;
  margin-top: 4rem;
`;

const SectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5rem 2rem;
  background-color: #F3F6FF;
  margin-bottom: 1rem;
`;

const TextSection = styled.div`
  flex: 2;
  padding-left: 2rem;

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

const SolicitudCard = ({ solicitud }) => {
  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <SectionContainer>
      <ImageSection>
        <img
          src={solicitud.Departamento.imagen ? `http://localhost:3000/${solicitud.Departamento.imagen}` : defaultImageUrl}
          alt={solicitud.Departamento.nombre}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImageUrl;
          }}
        />
      </ImageSection>
      <TextSection>
        <h6>Solicitud de Visita</h6>
        <h1>{solicitud.Departamento.nombre}</h1>
        <ul>
          <li>
            <h5><FaAddressCard style={{ color: '#DFB163' }} /> <span>Dirección:</span> {solicitud.Departamento.direccion}</h5>
          </li>
          <li>
            <h5><FaCalendarAlt style={{ color: '#DFB163' }} /> <span>Fecha Solicitada:</span> {new Date(solicitud.fecha_solicitada).toLocaleDateString()}</h5>
          </li>
          <li>
            <h5><FaComments style={{ color: '#DFB163' }} /> <span>Comentario:</span> {solicitud.comentario}</h5>
          </li>
        </ul>
      </TextSection>
    </SectionContainer>
  );
};

const SolicitudesVisita = () => {
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
        const userId = decoded.id;

        const response = await axios.get(`http://localhost:3000/solicitudes-visita/${userId}`, {
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

  return (
    <div>
      <NavBarEstudiante />
      <MainContainer>
        {solicitudes.map((solicitud) => (
          <SolicitudCard key={solicitud.id_solicitud_visita} solicitud={solicitud} />
        ))}
      </MainContainer>
    </div>
  );
};

export default SolicitudesVisita;