import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import NavBarArrendador from './NavBarArrendador';

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
      <h2>Perfil del Arrendador</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>RUC:</label>
            <input type="text" name="RUC" value={profile.RUC} readOnly />
          </div>
          <div>
            <label>Nombres:</label>
            <input type="text" name="nombres" value={profile.nombres} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
          </div>
          <div>
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={profile.telefono} onChange={handleChange} />
          </div>
          <div>
            <label>Dirección:</label>
            <input type="text" name="direccion" value={profile.direccion} onChange={handleChange} />
          </div>
          <div>
            <label>Estado:</label>
            <input type="checkbox" name="estado" checked={profile.estado} onChange={() => setProfile({ ...profile, estado: !profile.estado })} />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      ) : (
        <div>
          <p><strong>RUC:</strong> {profile.RUC}</p>
          <p><strong>Nombres:</strong> {profile.nombres}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Teléfono:</strong> {profile.telefono}</p>
          <p><strong>Dirección:</strong> {profile.direccion}</p>
          <p><strong>Estado:</strong> {profile.estado ? 'Activo' : 'Inactivo'}</p>
          <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
        </div>
      )}
    </div>
  );
};

export default ArrendadorProfile;
