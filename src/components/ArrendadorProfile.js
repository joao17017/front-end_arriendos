import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #F3F6FF; /* Color de fondo */
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px; /* Ajusta este valor según la altura de tu barra de navegación */
`;

const Header = styled.div`
  width: 100%;
  background-color: #DFB163; /* Color de fondo del encabezado */
  color: #252531; /* Color de texto del encabezado */
  padding: 20px;
  text-align: center;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2rem;
  color: #252531; /* Color de texto del título */
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid #252531; /* Color del borde del círculo */
  background-color: transparent; /* Fondo transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* Centra el componente horizontalmente */
  position: relative;
`;

const Icon = styled.svg`
  width: 60px;
  height: 60px;
  fill: #252531; /* Color del ícono */
`;

const Form = styled.form`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 1rem;
    color: #252531; /* Color de texto de las etiquetas */
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    padding: 12px;
    border: 1px solid #DFB163; /* Color de borde inicial de los campos de entrada */
    border-radius: 8px;
    font-size: 1rem;
    color: #252531; /* Color de texto de los campos de entrada */
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #252531; /* Color de borde al enfocar el campo */
      outline: none; /* Elimina el borde azul predeterminado al enfocar */
    }
  }

  input[type="checkbox"] {
    align-self: flex-start;
    margin-top: 7px;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #DFB163; /* Color de fondo del botón */
  color: #252531; /* Color de texto del botón */
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #252531; /* Color de fondo del botón al pasar el mouse */
    color: white; /* Color de texto del botón al pasar el mouse */
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const ProfileDetails = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;

  p {
    margin: 0;
    font-size: 1.125rem;
    color: #252531; /* Color de texto de los detalles del perfil */

    strong {
      font-weight: bold;
    }
  }
`;

const ArrendadorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    nombres: '',
    email: '',
    telefono: '',
    direccion: '',
    estado: false,
    RUC: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get(`/arrendadores/${user.id}`)
        .then(response => {
          setProfile(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the arrendador profile!", error);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/arrendadores/${user.id}`, profile)
      .then(response => {
        alert("Perfil actualizado exitosamente");
        setIsEditing(false);
      })
      .catch(error => {
        console.error("Hubo un error actualizando el perfil", error);
      });
  };

  return (
    <div>
      <NavBarArrendador />
      <Container>
        <Header>
          <ProfileImage>
            <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-7 3-7 7v1h14v-1c0-4-3-7-7-7z" />
            </Icon>
          </ProfileImage>
          <Title>Perfil del Arrendador</Title>
        </Header>
        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label>RUC:</label>
              <input type="text" name="RUC" value={profile.RUC} readOnly />
            </FormGroup>
            <FormGroup>
              <label>Nombres:</label>
              <input type="text" name="nombres" value={profile.nombres} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Email:</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Teléfono:</label>
              <input type="text" name="telefono" value={profile.telefono} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Dirección:</label>
              <input type="text" name="direccion" value={profile.direccion} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Estado:</label>
              <input type="checkbox" name="estado" checked={profile.estado} onChange={() => setProfile({ ...profile, estado: !profile.estado })} />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button type="submit" primary>Guardar Cambios</Button>
              <Button type="button" primary onClick={() => setIsEditing(false)}>Cancelar</Button>
            </div>
          </Form>
        ) : (
          <ProfileDetails>
            <p><strong>RUC:</strong> {profile.RUC}</p>
            <p><strong>Nombres:</strong> {profile.nombres}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Teléfono:</strong> {profile.telefono}</p>
            <p><strong>Dirección:</strong> {profile.direccion}</p>
            <p><strong>Estado:</strong> {profile.estado ? 'Activo' : 'Inactivo'}</p>
            <Button primary onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          </ProfileDetails>
        )}
      </Container>
    </div>
  );
};

export default ArrendadorProfile;
