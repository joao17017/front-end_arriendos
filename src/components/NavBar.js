import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


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
{/* Navbar */}
      <div className="container-fluid position-relative nav-bar p-0">
        <div className="container position-relative" style={{ zIndex: 9 }}>
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
                
                <div className="nav-item dropdown">
                  
                  <div className="dropdown-menu rounded-0 m-0">
                    
                  </div>
                </div>
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

      <div className="container-fluid bg-white py-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 text-left mb-3 mb-lg-0">
              <div className="d-inline-flex text-left">
                
                <div className="d-flex flex-column">
                  
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-left text-lg-center mb-3 mb-lg-0">
              <div className="d-inline-flex text-left">
                
                <div className="d-flex flex-column">
                  
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-left text-lg-right mb-3 mb-lg-0">
              <div className="d-inline-flex text-left">
                
                <div className="d-flex flex-column">
                  
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