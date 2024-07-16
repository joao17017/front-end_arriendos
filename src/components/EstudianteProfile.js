import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';

// Estilos con styled-components
const ProfileContainer = styled.div`
  background-color: #F3F6FF;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  
  div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #252531;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #DFB163;
    border-radius: 4px;
    font-size: 1rem;
    color: #252531;

    &:focus {
      border-color: #252531;
      outline: none;
    }
  }

  button {
    background-color: #DFB163;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #252531;
    }
  }
`;

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
      <ProfileContainer>
        <h2>Perfil de Estudiante</h2>
        <ProfileForm onSubmit={handleSubmit}>
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
        </ProfileForm>
      </ProfileContainer>
    </div>
  );
};

export default EstudianteProfile;
