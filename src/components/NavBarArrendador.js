// src/components/NavBarArrendador.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './NavBarEstudiante.css';

Modal.setAppElement('#root');

const NavBarArrendador = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout');
      localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
      navigate('/'); // Redirigir a la página de inicio
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      navigate(`/buscar?query=${searchQuery}`);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/arrendador/dashboard" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <button className="navbar-button" onClick={() => navigate('/arrendador/mis-departamentos')}>Departamentos</button>
          <button className="navbar-button" onClick={() => navigate('/arrendador/anuncios-por-activar')}>Anuncios por Activar</button>
          <button className="navbar-button" onClick={() => navigate('#')}>Anuncios Activados</button>
          <button className="navbar-button" onClick={() => navigate('#')}>Solicitudes de Visita</button>
          <div className="navbar-account">
            <FaUserCircle size={24} onClick={toggleDropdown} />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => navigate('/perfil')}>Mi Perfil</button>
                <button className="dropdown-item" onClick={handleLogout}>Salir</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBarArrendador;
