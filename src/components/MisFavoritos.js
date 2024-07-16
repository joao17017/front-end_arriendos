// components/MisFavoritos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importación corregida
import NavBarEstudiante from './NavBarEstudiante';
import styled from 'styled-components';
import { FaEye, FaTrash } from 'react-icons/fa';

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
  position: relative; /* Ensure that the overlay can be positioned absolutely within this container */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: opacity 0.3s ease; /* Smooth transition for image */
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease; /* Smooth transition for overlay */
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
  }

  &:hover .overlay {
    opacity: 1; /* Show overlay on hover */
  }

  .overlay h5 {
    color: white; /* Ensure the text is white */
    margin-bottom: 10px; /* Add margin to the bottom */
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
  justify-content: center;

  .icon-button {
    background: none; /* Remove background */
    border: none; /* Remove border */
    color: white; /* Default color */
    font-size: 24px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #ccc; /* Lighten the color on hover */
    }

    &.btn-danger {
      color: #dc3545; /* Color for danger icon */
    }

    &.btn-primary {
      color: #007bff; /* Color for primary icon */
    }
  }
`;

const MisFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`http://localhost:3000/favoritos/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFavoritos(response.data);
      } catch (err) {
        console.error('Error fetching favoritos:', err);
      }
    };

    fetchFavoritos();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/favoritos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoritos(favoritos.filter(favorito => favorito.id_favorito !== id));
    } catch (err) {
      console.error('Error deleting favorito:', err);
    }
  };

  const handleVer = (id_departamento) => {
    navigate(`/departamentos/${id_departamento}`);
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarEstudiante />
      <Container>
        <Title>Mis Favoritos</Title>
        <Row>
          {favoritos.map(favorito => (
            <Col key={favorito.id_favorito}>
              <Card>
                <img
                  src={favorito.DepartamentoActivo?.Departamento.imagen ? `http://localhost:3000/${favorito.DepartamentoActivo.Departamento.imagen}` : defaultImageUrl}
                  alt={favorito.DepartamentoActivo?.Departamento.nombre}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImageUrl;
                  }}
                />
                <div className="overlay">
                  <h5>{favorito.DepartamentoActivo?.Departamento.nombre}</h5>
                  <ButtonRow>
                    <button onClick={() => handleVer(favorito.id_departamento_activo)} className="icon-button btn-primary"><FaEye /></button>
                    <button onClick={() => handleEliminar(favorito.id_favorito)} className="icon-button btn-danger"><FaTrash /></button>
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

export default MisFavoritos;
