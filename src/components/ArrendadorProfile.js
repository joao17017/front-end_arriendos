import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const Form = styled.form`
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
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  input[type="checkbox"] {
    align-self: flex-start;
    margin-top: 7px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => (props.primary ? '#007bff' : '#28a745')};
  color: white;
  font-size: 1rem;

  &:hover {
    background-color: ${props => (props.primary ? '#0056b3' : '#218838')};
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    margin: 0;

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
        <Title>Perfil del Arrendador</Title>
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
            <div>
              <Button type="submit" primary>Guardar Cambios</Button>
              <Button type="button" onClick={() => setIsEditing(false)}>Cancelar</Button>
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
