import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import NavBar from './NavBar';

const Signup = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    telefono: '',
    contrasena: '',
    tipoUsuario: 'estudiante',
    cedula: '',
    ruc: '',
    direccion: '',
    universidad: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/usuarios/register', formData);
      setSubmitted(true);
      setError('');
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error registrando usuario');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="signup-container">
        {submitted ? (
          <div className="confirmation-message">
            <h2>Cuenta creada exitosamente</h2>
            <p>Se ha enviado a su correo electrónico de confirmación.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <label>Tipo de Usuario:</label>
              <select name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required>
                <option value="estudiante">Estudiante</option>
                <option value="arrendador">Arrendador</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nombres:</label>
              <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
            </div>
            {formData.tipoUsuario === 'estudiante' && (
              <>
                <div className="form-group">
                  <label>Cédula:</label>
                  <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Universidad:</label>
                  <input type="text" name="universidad" value={formData.universidad} onChange={handleChange} required />
                </div>
              </>
            )}
            {formData.tipoUsuario === 'arrendador' && (
              <>
                <div className="form-group">
                  <label>RUC:</label>
                  <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Dirección:</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>
              </>
            )}
            <button type="submit" className="signup-button">Signup</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
