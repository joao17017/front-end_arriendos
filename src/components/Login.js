import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Importa tu archivo CSS
import departamentoImage from '../imag/Departamento.jpg'; // Importa la imagen
import NavBar from './NavBar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, contrasena: password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.tipo);

      switch(response.data.tipo) {
        case 'estudiante':
          navigate('/estudiante/dashboard');
          break;
        case 'arrendador':
          navigate('/arrendador/dashboard');
          break;
        case 'administrador':
          navigate('/administrador/dashboard');
          break;
        default:
          setError('Tipo de usuario no reconocido');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <NavBar /> {/* No se modifica la NavBar */}
      <div className="login-container">
        <div className="login-info-container">
          <h1 className="title">Iniciar Sesión</h1>
          <form className="inputs-container" onSubmit={handleLogin}>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder=" "
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="label">Correo Electrónico</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                className="input"
                placeholder=" "
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="label">Contraseña</label>
            </div>
            
            {error && <p className="error-message">{error}</p>} {/* Muestra el error si existe */}
            
            <p>¿Olvidaste tu contraseña? <span className="span">Haz clic aquí</span></p>
            <button type="submit" className="btn">Login</button>
            <p>¿No tiene una cuenta aún? <span className="span">Regístrate</span></p>
          </form>
        </div>
        <img className="image-container" src={departamentoImage} alt="Departamento" /> {/* Utiliza la imagen importada */}
      </div>
    </div>
  );
};

export default Login;
