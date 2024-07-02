// components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Home.css';

const Home = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentosActivos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/departamentos-activos');
        const departamentosActivos = response.data.map(da => da.Departamento); 
        setDepartamentos(departamentosActivos);
      } catch (err) {
        setError('Error al obtener los departamentos activos');
        console.error(err);
      }
    };

    fetchDepartamentosActivos();
  }, []);

  const handleDepartamentoClick = (id) => {
    navigate(`/departamentos/${id}`);
  };

  return (
    <div>
      <NavBar />
      <div className="home-container">
        <h1>Bienvenidos a Arriendos Riobamba</h1>
        <p>Encuentra los mejores arriendos en Riobamba.</p>
        {error && <p className="error-message">{error}</p>}
        <div className="cards-container">
          {departamentos.map((departamento) => (
            <div
              className="card"
              key={departamento.id_departamento}
              onClick={() => handleDepartamentoClick(departamento.id_departamento)}
            >
              <img 
                src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : '/images/default-image.png'} 
                alt={departamento.nombre} 
                className="card-image" 
              />
              <div className="card-content">
                <h3>{departamento.nombre}</h3>
                <p>{departamento.direccion}</p>
                <p>{departamento.precio}</p>
                <p>{departamento.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
