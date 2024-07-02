import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './NavBarAdministrador.css';

Modal.setAppElement('#root');

const NavBarAdministrador = ({ onGestionarUsuariosClick }) => {
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
        <Link to="/administrador/dashboard" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <input
            type="text"
            placeholder="Buscar departamentos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <button className="navbar-button" onClick={() => navigate('/buscarconbot')}>Gestionar Departamentos</button>
          <button className="navbar-button" onClick={() => navigate('/favoritos')}>Administrar Solicitudes</button>
          <button className="navbar-button" onClick={onGestionarUsuariosClick}>Gestionar Usuarios</button>
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

export default NavBarAdministrador;
