// src/components/BuscarDepartamentos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './BuscarDepartamentos.css';

const BuscarDepartamentos = () => {
  const [query, setQuery] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/bot/search?query=${query}`);
      setDepartamentos(response.data);
      setError('');
    } catch (err) {
      console.error('Error al buscar departamentos:', err);
      setError('Error al buscar departamentos');
    }
  };

  return (
    <div className="buscar-departamentos-container">
      <h1>Buscar Departamentos</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ingrese su búsqueda"
      />
      <button onClick={handleSearch}>Buscar</button>
      {error && <p className="error-message">{error}</p>}
      <div className="departamentos-list">
        {departamentos.map((departamento) => (
          <div className="departamento-card" key={departamento.id_departamento}>
            <h3>{departamento.nombre}</h3>
            <p><strong>Dirección:</strong> {departamento.direccion}</p>
            <p><strong>Precio:</strong> ${departamento.precio}</p>
            <p><strong>Descripción:</strong> {departamento.descripcion}</p>
            <p><strong>Acepta Perros:</strong> {departamento.aceptan_perros ? 'Sí' : 'No'}</p>
            <p><strong>Número de Baños:</strong> {departamento.n_banos}</p>
            <p><strong>Número de Habitaciones:</strong> {departamento.n_habitaciones}</p>
            <p><strong>Tamaño:</strong> {departamento.tamano_m_cuadrados} m²</p>
            <img 
              src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : '/images/default-image.png'} 
              alt={departamento.nombre} 
              className="departamento-image" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuscarDepartamentos;
