// src/components/EstudianteProfile.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import './EstudianteProfile.css'; // Importa el archivo CSS
import NavBarEstudiante from './NavBarEstudiante'; // Importa la barra de navegación

const EstudianteProfile = () => {
  const [estudiante, setEstudiante] = useState({
    id_usuario: '',
    nombres: '',
    cedula: '',
    telefono: '',
    email: '',
    universidad: '',
    contrasena: '',
    estado: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/estudiante'); // Cambia la URL según tu configuración
        setEstudiante(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching estudiante data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEstudiante({
      ...estudiante,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/estudiante/${estudiante.id_usuario}`, estudiante);
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error updating estudiante data:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <NavBarEstudiante />
      <div className="profile-container">
        <h2>Perfil de Estudiante</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div>
            <label>Nombres:</label>
            <input
              type="text"
              name="nombres"
              value={estudiante.nombres}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Cédula:</label>
            <input
              type="text"
              name="cedula"
              value={estudiante.cedula}
              readOnly
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={estudiante.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={estudiante.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Universidad:</label>
            <input
              type="text"
              name="universidad"
              value={estudiante.universidad}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={estudiante.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <input
              type="checkbox"
              name="estado"
              checked={estudiante.estado}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Actualizar Perfil</button>
        </form>
      </div>
    </div>
  );
};

export default EstudianteProfile;
