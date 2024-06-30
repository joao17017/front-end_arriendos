import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './NavBarEstudiante.css';

Modal.setAppElement('#root');

const NavBarEstudiante = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      navigate(`/buscar?query=${searchQuery}`);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/estudiante/dashboard" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <input
            type="text"
            placeholder="Buscar departamentos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <button className="navbar-button" onClick={() => navigate('/buscarconbot')}>Buscar con Bot</button>
          <button className="navbar-button" onClick={() => navigate('/favoritos')}>Favoritos</button>
          <button className="navbar-button" onClick={() => navigate('/estudiante/dashboard')}>Anuncios</button>
          <button className="navbar-button" onClick={() => navigate('/solicitudes-visita')}>Solicitud de Visita</button>
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

export default NavBarEstudiante;
