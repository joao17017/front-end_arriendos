import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './NavBar.css'; // Asegúrate de importar el archivo CSS para los estilos

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <div>
      <nav className="navbar">
        <Link to="/arrendador/dashboard" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <button className="navbar-button" onClick={() => navigate('/arrendador/crear-departamento')}>Crear Departamento</button>
          <button className="navbar-button" onClick={() => navigate('/arrendador/mis-departamentos')}>Departamentos</button>
          <button className="navbar-button" onClick={() => navigate('/arrendador/anuncios-por-activar')}>Anuncios por Activar</button>
          <button className="navbar-button" onClick={() => navigate('/arrendador/anuncios-activados')}>Anuncios Activados</button>
          <button className="navbar-button" onClick={() => navigate('/arrendador/solicitudes-visita')}>Solicitudes de Visita</button>
          <button className="navbar-button" onClick={() => navigate('/arrendador/departamentos-arrendados')}>Departamentos Arrendados</button>
          <div className="navbar-account">
            <FaUserCircle size={24} onClick={toggleDropdown} />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => navigate('/arrendador/perfil')}>Mi Perfil</button>
                <button className="dropdown-item" onClick={handleLogout}>Salir</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
