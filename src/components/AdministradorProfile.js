// src/components/AdministradorProfile.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import './AdministradorProfile.css'; // Importa el archivo CSS
import NavBarAdministrador from './NavBarAdministrador'; // Importa la barra de navegación

const AdministradorProfile = () => {
  const [administrador, setAdministrador] = useState({
    id_administrador: '',
    nombres: '',
    cedula: '',
    telefono: '',
    email: '',
    contrasena: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/administrador'); // Cambia la URL según tu configuración
        setAdministrador(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching administrador data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdministrador({
      ...administrador,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/administrador/${administrador.id_administrador}`, administrador);
      alert('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error updating administrador data:', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <NavBarAdministrador onGestionarUsuariosClick={() => {}} />
      <div className="profile-container">
        <h2>Perfil de Administrador</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div>
            <label>Nombres:</label>
            <input
              type="text"
              name="nombres"
              value={administrador.nombres}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Cédula:</label>
            <input
              type="text"
              name="cedula"
              value={administrador.cedula}
              readOnly
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={administrador.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={administrador.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={administrador.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Actualizar Perfil</button>
        </form>
      </div>
    </div>
  );
};

export default AdministradorProfile;
