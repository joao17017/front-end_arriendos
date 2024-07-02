import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <button className="navbar-button" onClick={handleLoginRedirect}>Login</button>
          <Link to="/signup" className="navbar-button-link">Signup</Link>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
