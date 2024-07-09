import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import {jwtDecode} from 'jwt-decode'; // Corregido, sin llaves.
import './DepartamentoDetalles.css';
const DepartamentoDetalles = () => {
  const { id } = useParams(); // id del departamento obtenido desde los parámetros de la URL
  const [departamento, setDepartamento] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [fechaSolicitada, setFechaSolicitada] = useState(''); // Nuevo estado para la fecha solicitada
  const [comentario, setComentario] = useState(''); // Nuevo estado para el comentario

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

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
    }
  }, [id]);

  const handleSolicitudVisita = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para solicitar una visita');
        return;
      }

      const decoded = jwtDecode(token);
      const id_usuario = decoded.id;

      const response = await axios.post('http://localhost:3000/solicitudes-visita', {
        id_departamento: id, // id del departamento obtenido desde los parámetros de la URL
        id_usuario, // id del usuario obtenido desde el token
        fecha_solicitada: fechaSolicitada, // Fecha solicitada ingresada por el usuario
        comentario // Comentario ingresado por el usuario
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensaje('Solicitud de visita enviada correctamente');
      alert('Solicitud de visita enviada correctamente');
    } catch (err) {
      console.error('Error al enviar la solicitud de visita:', err);
      setError(err.response?.data?.error || 'Error al enviar la solicitud de visita');
    }
  };

  const handleAnadirAFavorito = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para añadir a favoritos');
        return;
      }

      const decoded = jwtDecode(token);
      const id_usuario = decoded.id;

      const response = await axios.post('http://localhost:3000/favoritos', {
        id_usuario,
        id_departamento: id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensaje('Añadido a favoritos correctamente');
      alert('Añadido a favoritos correctamente');
    } catch (err) {
      console.error('Error al añadir a favoritos:', err);
      setError(err.response?.data?.error || 'Error al añadir a favoritos');
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!departamento) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      {usuario && usuario.tipo === 'estudiante' && (
      <NavBarEstudiante />
    )}
    
      {usuario && usuario.tipo === 'administrador' && (
      <NavBarAdministrador />
    )}
     {usuario && usuario.tipo === 'arrendador' && (
      <NavBarArrendador />
    )}
      <div className="detalles-container">
        <div className="image-container">
          <img src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : '/images/image.png'} alt={departamento.nombre} className="detalles-image" />
          {usuario && usuario.tipo === 'estudiante' && (
            <button className="solicitar-visita-button" onClick={handleSolicitudVisita}>Solicitar Visita</button>
          )}
          {usuario && usuario.tipo === 'estudiante' && (
            <button className="anadir-a-favorito" onClick={handleAnadirAFavorito}>Añadir a Favorito</button>
          )}
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
        {usuario && usuario.tipo === 'estudiante' && (
        <div className="solicitud-visita-form">
          <label>
            Fecha Solicitada:
            <input 
              type="date" 
              value={fechaSolicitada} 
              onChange={(e) => setFechaSolicitada(e.target.value)} 
            />
          </label>
          <label>
            Comentario:
            <textarea 
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} 
            />
          </label>
          <button onClick={handleSolicitudVisita}>Enviar Solicitud de Visita</button>
        </div>
        )}
      </div>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default DepartamentoDetalles;
