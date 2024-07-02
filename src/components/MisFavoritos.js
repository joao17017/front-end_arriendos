//components/MisFavoritos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarEstudiante from './NavBarEstudiante';
import './MisFavoritos.css';

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

  return (
    <div>
      <NavBarEstudiante />
      <div className="container">
        <h1>Mis Favoritos</h1>
        <div className="favoritos-grid">
          {favoritos.map(favorito => (
            <div className="favorito-card" key={favorito.id_favorito}>
              <img
                src={favorito.Departamento.imagen ? `http://localhost:3000/${favorito.Departamento.imagen}` : '/images/default-image.png'}
                alt={favorito.Departamento.nombre}
                className="favorito-image"
              />
              <div className="favorito-details">
                <h2>{favorito.Departamento.nombre}</h2>
                <p>{favorito.Departamento.descripcion}</p>
                <div className="favorito-buttons">
                  <button onClick={() => handleVer(favorito.id_departamento)} className="button button-view">Ver</button>
                  <button onClick={() => handleEliminar(favorito.id_favorito)} className="button button-delete">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MisFavoritos;
