import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode correctamente
import NavBarAdministrador from './NavBarAdministrador';
import NavBarArrendador from './NavBarArrendador';
import NavBarEstudiante from './NavBarEstudiante';

// Styled components
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px); /* Asegúrate de que el contenedor tenga en cuenta el tamaño de la navbar */
  background-color: #f8f9fa; /* Mantener el color de fondo original */
  margin-top: 56px; /* Ajusta el margen superior para que el contenido aparezca debajo de la navbar */
`;

const FormContainer = styled.div`
  background: #F3F6FF; /* Color de fondo del contenedor del formulario */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #252531; /* Color de las letras de las etiquetas */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #DFB163; /* Color de los bordes del input */
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #252531; /* Color del borde al seleccionar el input */
  }
`;

const Button = styled.button`
  background: #DFB163; /* Color de fondo del botón */
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #252531; /* Color de fondo del botón al poner el mouse sobre él */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const userType = decoded.tipo;

        const response = await axios.get('http://localhost:3000/usuarios/perfil', {
          params: {
            id: userId,
            tipo: userType,
          },
        });
        setProfile(decoded);
        setFormData(response.data);
      } catch (err) {
        setError('Error al cargar el perfil');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const userType = decoded.tipo;

      const response = await axios.put('http://localhost:3000/usuarios/perfil', {
        ...formData,
        id: userId,
        tipo: userType,
      });
      setSuccess('Perfil actualizado exitosamente');
      setError('');
      setProfile(response.data);
    } catch (err) {
      setError('Error actualizando el perfil');
      setSuccess('');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const userType = decoded.tipo;

      await axios.put('http://localhost:3000/usuarios/perfil/cambiar-contrasena', {
        id: userId,
        tipo: userType,
        oldPassword,
        newPassword,
      });
      setSuccess('Contraseña actualizada exitosamente');
      setError('');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Error cambiando la contraseña');
      setSuccess('');
    }
  };

  return (
    <div>
      {profile.tipo === 'estudiante' && (<NavBarEstudiante />)}
      {profile.tipo === 'arrendador' && (<NavBarArrendador />)}
      {profile.tipo === 'administrador' && (<NavBarAdministrador />)}
      <ProfileContainer>
        <FormContainer>
          {profile.tipo === 'estudiante' && (<Title>Mi Perfil de Estudiante</Title>)}
          {profile.tipo === 'arrendador' && (<Title>Mi Perfil de Arrendador</Title>)}
          {profile.tipo === 'administrador' && (<Title>Mi Perfil de Administrador</Title>)}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <ErrorMessage style={{ color: 'green' }}>{success}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nombres:</Label>
              <Input type="text" name="nombres" value={formData.nombres || ''} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Teléfono:</Label>
              <Input type="text" name="telefono" value={formData.telefono || ''} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
            </FormGroup>
            {profile.tipo === 'estudiante' && (
              <>
                <FormGroup>
                  <Label>Universidad:</Label>
                  <Input type="text" name="universidad" value={formData.universidad || ''} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Cédula:</Label>
                  <Input type="text" name="cedula" value={formData.cedula || ''} onChange={handleChange} required />
                </FormGroup>
              </>
            )}
            {profile.tipo === 'arrendador' && (
              <>
                <FormGroup>
                  <Label>RUC:</Label>
                  <Input type="text" name="RUC" value={formData.RUC || ''} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Dirección:</Label>
                  <Input type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} required />
                </FormGroup>
              </>
            )}
            {profile.tipo === 'administrador' && (
              <>
                <FormGroup>
                  <Label>Cédula:</Label>
                  <Input type="text" name="cedula" value={formData.cedula || ''} onChange={handleChange} required />
                </FormGroup>
              </>
            )}
            <Button type="submit">Actualizar Perfil</Button>
          </Form>
          <Form onSubmit={handleChangePassword}>
            <FormGroup>
              <Label>Contraseña Actual:</Label>
              <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label>Nueva Contraseña:</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </FormGroup>
            <Button type="submit">Cambiar Contraseña</Button>
          </Form>
        </FormContainer>
      </ProfileContainer>
    </div>
  );
};

export default Profile;
