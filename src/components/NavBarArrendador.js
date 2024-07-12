import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  .navbar-bottom {
    background-color: #6c757d;
    padding: 10px 0;
  }

  @media (max-width: 992px) {
    .navbar-bottom {
      padding: 15px 10px;
    }
  }
`;

const NavbarBottom = styled.nav`
  background-color: #6c757d;
  padding: 10px 0;
`;

const Brand = styled(Link)`
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;

  span {
    color: #007bff;
  }

  @media (max-width: 992px) {
    font-size: 1.25rem;
  }
`;

const Toggler = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  display: none;

  &:focus {
    outline: none;
  }

  @media (max-width: 992px) {
    display: block;
  }
`;

const Collapse = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 992px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    width: 100%;
  }
`;

const NavItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 10px 15px;
  font-size: 1rem;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 992px) {
    padding: 10px;
    width: 100%;
    text-align: left;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  .dropdown-menu {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    background-color: #252531;
    min-width: 160px;
    z-index: 1;
    right: 0;
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    color: #fff;
    background-color: #252531;
    border: none;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: #1c1c28;
    }
  }
`;

const NavBarArrendador = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
    <NavbarContainer>
      <NavbarBottom className="navbar navbar-expand-lg navbar-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <Brand to="/arrendador/dashboard">
            <span>RIO</span>ARRIENDOS
          </Brand>
          <Toggler
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarCollapse"
            aria-expanded={isOpen}
          >
            <i className="fas fa-bars"></i>
          </Toggler>
          <Collapse className={`collapse navbar-collapse`} id="navbarCollapse">
            <NavMenu isOpen={isOpen}>
              <NavItem to="/arrendador/crear-departamento">Crear Departamento</NavItem>
              <NavItem to="/arrendador/mis-departamentos">Departamentos</NavItem>
              <NavItem to="/arrendador/anuncios-por-activar">Anuncios por Activar</NavItem>
              <NavItem to="/arrendador/anuncios-activados">Anuncios Activados</NavItem>
              <NavItem to="/arrendador/solicitudes-visita">Solicitudes de Visita</NavItem>
              <NavItem to="/arrendador/departamentos-arrendados">Departamentos Arrendados</NavItem>
              <DropdownContainer isOpen={dropdownOpen}>
                <FaUserCircle size={24} onClick={toggleDropdown} />
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => navigate('/arrendador/perfil')}>
                    Mi Perfil
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Salir
                  </button>
                </div>
              </DropdownContainer>
            </NavMenu>
          </Collapse>
        </div>
      </NavbarBottom>
    </NavbarContainer>
  );
};

export default NavBarArrendador;
