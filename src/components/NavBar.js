import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import './NavBar.css';

Modal.setAppElement('#root');

const NavBar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Definir el estado successMessage
  const navigate = useNavigate(); // Reemplaza useHistory con useNavigate

  const openModal = () => {
    setModalIsOpen(true);
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setError('');
    setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, contrasena: password });
      const { token, message, tipo } = response.data;
      localStorage.setItem('token', token); // Almacenar el token en localStorage
      setSuccessMessage(message);
      closeModal();

      // Redirigir basado en el tipo de usuario
      if (tipo === 'estudiante') {
        navigate('/estudiante/dashboard');
      } else if (tipo === 'administrador') {
        navigate('/administrador/dashboard');
      } else if (tipo === 'arrendador') {
        navigate('/arrendador/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <button className="navbar-button" onClick={openModal}>Login</button>
          <Link to="/signup" className="navbar-button-link">Signup</Link>
        </div>
      </nav>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="modal-button">Login</button>
          <button type="button" className="modal-button" onClick={closeModal}>Cerrar</button>
        </form>
      </Modal>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default NavBar;
