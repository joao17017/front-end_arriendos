import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './NavBarArrendador.css'; // Asegúrate de importar el archivo CSS para los estilos

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
      <div className="container-fluid bg-dark py-3 navbar-top" >
        <div className="container" style={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-md-6 text-center text-lg-left mb-2 mb-lg-0">
              <div className="d-inline-flex align-items-center">
                {/* Aquí puedes añadir contenido adicional si es necesario */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid position-relative nav-bar p-0">
        <div className="container position-relative" style={{ zIndex: 9 }}>
          <nav className="navbar navbar-expand-lg bg-secondary navbar-dark py-3 py-lg-0 pl-3 pl-lg-5 navbar-bottom">
            <Link to="/arrendador/dashboard" className="navbar-brand">
              <h1 className="m-0 display-5 text-white rioarriendos-title">
                <span className="text-primary">RIO</span>ARRIENDOS
              </h1>
            </Link>
            <button
              type="button"
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-between px-3"
              id="navbarCollapse"
            >
              <div className="navbar-nav ml-auto py-0">
                <Link to="/arrendador/crear-departamento" className="nav-item nav-link">Crear Departamento</Link>
                <Link to="/arrendador/mis-departamentos" className="nav-item nav-link">Departamentos</Link>
                <Link to="/arrendador/anuncios-por-activar" className="nav-item nav-link">Anuncios por Activar</Link>
                <Link to="/arrendador/anuncios-activados" className="nav-item nav-link">Anuncios Activados</Link>
                <Link to="/arrendador/solicitudes-visita" className="nav-item nav-link">Solicitudes de Visita</Link>
                <Link to="/arrendador/departamentos-arrendados" className="nav-item nav-link">Departamentos Arrendados</Link>
                <div className="nav-item nav-link dropdown">
                  <FaUserCircle size={24} onClick={toggleDropdown} />
                  {dropdownOpen && (
                    <div className="dropdown-menu show">
                      <button className="dropdown-item" onClick={() => navigate('/arrendador/perfil')}>Mi Perfil</button>
                      <button className="dropdown-item" onClick={handleLogout}>Salir</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      
      
    </div>
  );
};

export default NavBar;
