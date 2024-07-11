import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';  // Asegúrate de tener los estilos CSS aplicados

const NavBar = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <div className="container-fluid bg-dark py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-lg-left mb-2 mb-lg-0">
              <div className="d-inline-flex align-items-center">
                {/* Contenido */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="container-fluid position-relative nav-bar-container p-0">  {/* Cambié la clase aquí */}
        <div className="container position-relative" style={{ zIndex: 9, padding: '0 15px' }}>
          <nav className="navbar navbar-expand-lg bg-secondary navbar-dark py-3 py-lg-0 pl-3 pl-lg-5">
            <a href="/" className="navbar-brand">
              <h1 className="m-0 display-5 text-white">
                <span className="text-primary">RIO</span>ARRIENDOS
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
              <div className="navbar-nav ml-auto py-0">
                <a href="/login" className="nav-item nav-link">
                  Login
                </a>
                <a href="/signup" className="nav-item nav-link">
                  Signup
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
