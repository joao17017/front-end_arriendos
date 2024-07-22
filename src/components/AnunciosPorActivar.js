// src/components/AnunciosPorActivar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import { FaInfoCircle, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const NavBarHeight = '60px'; // Ajusta este valor según el alto real de tu NavBar

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: ${NavBarHeight}; /* Añadir margen superior igual al alto de la NavBar */
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Col = styled.div`
  flex: 1 1 300px;
  max-width: 300px;
  position: relative; /* Ensures the overlay can be positioned absolutely within this container */
`;

const Card = styled.div`
  background-color: #DFB163;
  border: 2px solid black;
  border-radius: 8px;
  overflow: hidden;
  position: relative; /* Enable positioning of the overlay inside the card */
  height: 200px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-bottom: 2px solid black;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    padding: 10px;
    text-align: center;
    border-radius: 8px;
    box-sizing: border-box;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const EstadoTexto = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #DFB163; /* Color de texto y icono para el estado pendiente */
  background-color: transparent; /* Eliminar el fondo del estado */
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 10px;
  text-transform: uppercase; /* Convertir el texto a mayúsculas */

  .estado-icono {
    margin-right: 5px;
    color: #DFB163; /* Color del ícono para el estado pendiente */
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;

  .nav-button {
    background: none;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;

    &:hover {
      opacity: 0.8;
    }

    &.btn-edit {
      color: #ffc107; /* Amarillo para el botón Editar */
    }

    &.btn-delete {
      color: #dc3545; /* Rojo para el botón Eliminar */
    }

    &.btn-view {
      color: #007bff; /* Azul para el botón Ver */
    }
  }
`;

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

  //corregir api para borrar la solicitud
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/departamentos/${id}`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.Departamento.id_departamento !== id));
    } catch (err) {
      console.error('Error deleting departamento:', err);
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarArrendador />
      <Container>
        <Title>Anuncios por Activar de Arrendador</Title>
        <Row>
          {solicitudes.map(solicitud => (
            <Col key={solicitud.id_solicitud}>
              <Card>
                <img
                  src={solicitud.Departamento && solicitud.Departamento.imagen ? `http://localhost:3000/${solicitud.Departamento.imagen}` : defaultImageUrl}
                  alt={solicitud.Departamento ? solicitud.Departamento.nombre : 'Imagen no disponible'}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = defaultImageUrl;
                  }}
                />
                <div className="overlay">
                  <h5 style={{ color: 'white' }}>{solicitud.Departamento ? solicitud.Departamento.nombre : 'Departamento no encontrado'}</h5>
                  <EstadoTexto>
                    <FaInfoCircle className="estado-icono" /> {solicitud.estado}
                  </EstadoTexto>
                  <ButtonRow>
                    <Link to={`/departamentos/editar/${solicitud.Departamento.id_departamento}`} className="nav-button btn-edit"><FaEdit /></Link>
                    <button className="nav-button btn-delete" onClick={() => handleDelete(solicitud.Departamento.id_departamento)}><FaTrash /></button>
                    <Link to={`/arrendador/mis-departamentos/${solicitud.Departamento.id_departamento}`} className="nav-button btn-view"><FaEye /></Link>
                  </ButtonRow>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AnunciosPorActivar;
