// src/components/DepartamentoDetalles.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBarEstudiante from './NavBarEstudiante';
import './DepartamentoDetalles.css';

const DepartamentoDetalles = () => {
  const { id } = useParams();
  const [departamento, setDepartamento] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamentos/${id}`);
        setDepartamento(response.data);
      } catch (err) {
        setError('Error al obtener el departamento');
        console.error(err);
      }
    };

    fetchDepartamento();
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!departamento) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <NavBarEstudiante />
      <div className="detalles-container">
        <div className="image-container">
          <img src={departamento.imagen || '/images/image.png'} alt={departamento.nombre} className="detalles-image" />
          <button className="solicitar-visita-button">Solicitar Visita</button>
          <button className='anadir-a-favorito'>Añadir a Favorito</button>
        </div>
        <div className="detalles-content">
          <h1>{departamento.nombre}</h1>
          <p><strong>Dirección:</strong> {departamento.direccion}</p>
          <p><strong>Precio:</strong> {departamento.precio}</p>
          <p><strong>Descripción:</strong> {departamento.descripcion}</p>
          <p><strong>Número de Baños:</strong> {departamento.n_banos}</p>
          <p><strong>Número de Habitaciones:</strong> {departamento.n_habitaciones}</p>
          <p><strong>Tamaño en Metros Cuadrados:</strong> {departamento.tamano_m_cuadrados}</p>
          <p><strong>Acepta Gatos:</strong> {departamento.aceptan_gatos ? 'Sí' : 'No'}</p>
          <p><strong>Acepta Perros:</strong> {departamento.aceptan_perros ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Luz:</strong> {departamento.incluye_luz ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Agua:</strong> {departamento.incluye_agua ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Teléfono:</strong> {departamento.incluye_telefono ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Internet:</strong> {departamento.incluye_internet ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Garaje:</strong> {departamento.incluye_garaje ? 'Sí' : 'No'}</p>
          <p><strong>Lavandería:</strong> {departamento.lavanderia ? 'Sí' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default DepartamentoDetalles;
