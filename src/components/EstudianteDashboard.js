// EstudianteDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarEstudiante from './NavBarEstudiante';
import Filters from './Filters';
import './EstudianteDashboard.css';

const EstudianteDashboard = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
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
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/departamentos');
        setDepartamentos(response.data);
        setFilteredDepartamentos(response.data);
      } catch (err) {
        setError('Error al obtener los departamentos');
        console.error(err);
      }
    };

    fetchDepartamentos();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = departamentos;

      // Aplica cada filtro solo si está activado
      Object.keys(filters).forEach((key) => {
        if (key !== 'precioMin' && key !== 'precioMax' && filters[key]) {
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
              <img src={departamento.imagen || '/images/image.png'} alt={departamento.nombre} className="card-image" />
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
