//src/components/AnunciosActivados.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
`;

const Card = styled.div`
  background-color: #DFB163;
  border: 2px solid black;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 2px solid black;
  }

  .card-body {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h5 {
      margin-bottom: 10px;
    }

    p {
      flex: 1;
    }
  }

  .card-footer {
    background-color: #252531;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  button, .nav-link {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    color: white;

    &:hover {
      opacity: 0.9;
    }

    &.btn-primary {
      background-color: #007bff;

      &:hover {
        background-color: #0056b3;
      }
    }

    &.btn-danger {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }
    }

    &.btn-warning {
      background-color: #ffc107;
      color: black;

      &:hover {
        background-color: #e0a800;
      }
    }
  }
`;

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
            Authorization: `Bearer ${token}`,
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

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarArrendador />
      <Container>
        <Title>Anuncios Activados por Arrendador</Title>
        <Row>
          {solicitudes.map(solicitud => (
            <Col key={solicitud.Departamento.id_departamento}>
              <Card>
                <img
                  src={solicitud.Departamento && solicitud.Departamento.imagen ? `http://localhost:3000/${solicitud.Departamento.imagen}` : defaultImageUrl}
                  alt={solicitud.Departamento ? solicitud.Departamento.nombre : 'Imagen no disponible'}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = defaultImageUrl;
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{solicitud.Departamento ? solicitud.Departamento.nombre : 'Departamento no encontrado'}</h5>
                  <p className="card-text">{solicitud.Departamento ? solicitud.Departamento.descripcion : 'Descripción no disponible'}</p>
                </div>
                <div className="card-footer">
                  <ButtonRow>
                    <Link to={`/departamentos/editar/${solicitud.Departamento.id_departamento}`} className="nav-link btn-warning">Editar</Link>
                    <button className="btn-danger" onClick={() => handleDelete(solicitud.Departamento.id_departamento)}>Eliminar</button>
                    <Link to={`/arrendador/mis-departamentos/${solicitud.Departamento.id_departamento}`} className="nav-link btn-primary">Ver</Link>
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

export default AnunciosActivados;
