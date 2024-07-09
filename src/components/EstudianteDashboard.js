// src/components/EstudianteDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBarEstudiante from './NavBarEstudiante';
import Filters from './Filters';
import './EstudianteDashboard.css';

const EstudianteDashboard = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    todos_los_servicios_basicos: false,
    incluye_luz: false,
    incluye_agua: false,
    incluye_telefono: false,
    incluye_internet: false,
    incluye_garaje: false,
    aceptan_gatos: false,
    aceptan_perros: false,
    lavanderia: false,
    precioMin: '',
    precioMax: '',
    tamanoMin: '',
    tamanoMax: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDepartamentosActivos = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query') || '';
        let response;
        if (query) {
          response = await axios.get(`http://localhost:3000/bot/search?query=${query}`);
        } else {
          response = await axios.get('http://localhost:3000/departamentos-activos');
        }
        const departamentosActivos = response.data.map(da => da.Departamento || da);
        setDepartamentos(departamentosActivos);
      } catch (err) {
        setError('Error al obtener los departamentos activos');
        console.error(err);
      }
    };

    fetchDepartamentosActivos();
  }, [location.search]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = departamentos;

      // Filtrar por campos booleanos
      Object.keys(filters).forEach((key) => {
        if (filters[key] === true) {
          filtered = filtered.filter((departamento) => departamento[key]);
        }
      });

      // Filtrar por rango de precios
      if (filters.precioMin !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.precio) >= parseFloat(filters.precioMin)
        );
      }

      if (filters.precioMax !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.precio) <= parseFloat(filters.precioMax)
        );
      }

      // Filtrar por rango de tamaño
      if (filters.tamanoMin !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.tamano_m_cuadrados) >= parseFloat(filters.tamanoMin)
        );
      }

      if (filters.tamanoMax !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.tamano_m_cuadrados) <= parseFloat(filters.tamanoMax)
        );
      }

      setFilteredDepartamentos(filtered);
    };

    applyFilters();
  }, [filters, departamentos]);

  const handleDepartamentoClick = (id) => {
    navigate(`/departamentos/${id}`);
  };

  return (
    <div>
      <NavBarEstudiante />
      <div className="dashboard-container">
        <h1>Bienvenidos a Arriendos Riobamba</h1>
        <p>Encuentra los mejores arriendos en Riobamba.</p>
        <Filters filters={filters} setFilters={setFilters} />
        {error && <p className="error-message">{error}</p>}
        <div className="cards-container">
          {filteredDepartamentos.map((departamento) => (
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

export default EstudianteDashboard;
