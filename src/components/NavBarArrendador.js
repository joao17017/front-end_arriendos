import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';


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
      <div className="container-fluid bg-dark py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-lg-left mb-2 mb-lg-0">
              <div className="d-inline-flex align-items-center">
                {/* Puedes agregar elementos aquí si es necesario */}
              </div>
            </div>
            <div className="col-md-6 text-center text-lg-right">
              <div className="d-inline-flex align-items-center">
                <a className="text-white px-3" href="/">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="text-white px-3" href="/">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="text-white px-3" href="/">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a className="text-white px-3" href="/">
                  <i className="fab fa-instagram"></i>
                </a>
                <a className="text-white pl-3" href="/">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid position-relative nav-bar p-0">
        <div className="container position-relative" style={{ zIndex: 9 }}>
          <nav className="navbar navbar-expand-lg bg-secondary navbar-dark py-3 py-lg-0 pl-3 pl-lg-5">
            <a href="/arrendador/dashboard" className="navbar-brand">
              <h1 className="m-0 display-5 text-white" style={{ fontSize: '1.5rem' }}>
                <span className="text-primary">a</span>RRIENDOS RIOBAMBA
              </h1>
            </a>
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
              <div className="navbar-nav ml-auto py-0" style={{ fontSize: '0.7rem' }}>
                <Link to="/arrendador/crear-departamento" className="nav-item nav-link">Crear Departamento</Link>
                <Link to="/arrendador/mis-departamentos" className="nav-item nav-link">Departamentos</Link>
                <Link to="/arrendador/anuncios-por-activar" className="nav-item nav-link">Anuncios por Activar</Link>
                <Link to="/arrendador/anuncios-activados" className="nav-item nav-link">Anuncios Activados</Link>
                <Link to="/arrendador/solicitudes-visita" className="nav-item nav-link">Solicitudes de Visita</Link>
                
                <div className="navbar-account position-relative d-flex align-items-center justify-content-center">
                  <FaUserCircle size={24} onClick={toggleDropdown} />
                  {dropdownOpen && (
                    <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, backgroundColor: '#252531' }}>
                      <button className="dropdown-item text-white" style={{ backgroundColor: '#252531' }} onClick={() => navigate('/arrendador/perfil')}>Mi Perfil</button>
                      <button className="dropdown-item text-white" style={{ backgroundColor: '#252531' }} onClick={handleLogout}>Salir</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="container-fluid bg-white py-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 text-left mb-3 mb-lg-0">
              <div className="d-inline-flex text-left">
                {/* Puedes agregar elementos aquí si es necesario */}
                <div className="d-flex flex-column">
                  {/* Puedes agregar elementos aquí si es necesario */}
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-left text-lg-center mb-3 mb-lg-0">
              <div className="d-inline-flex text-left">
                {/* Puedes agregar elementos aquí si es necesario */}
                <div className="d-flex flex-column">
                  {/* Puedes agregar elementos aquí si es necesario */}
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-left text-lg-right mb-3 mb-lg-0">
              <div className="d-inline-flex text-left">
                {/* Puedes agregar elementos aquí si es necesario */}
                <div className="d-flex flex-column">
                  {/* Puedes agregar elementos aquí si es necesario */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
