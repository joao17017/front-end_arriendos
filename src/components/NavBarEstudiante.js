import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const NavBarContainer = styled.div`
  background-color: #343a40; /* Color de fondo constante */
  padding: 0.5rem 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled(Link)`
  font-size: 2rem;
  color: white; /* Color constante */
  text-decoration: none;

  .text-primary {
    color: #007bff;
  }
`;

const NavbarToggler = styled.button`
  background: none;
  border: none;
  color: white; /* Color constante */
  font-size: 1.5rem;

  &:focus {
    outline: none;
  }

  @media (min-width: 992px) {
    display: none;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 991px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  color: white; /* Color constante */
  text-decoration: none;
  margin-left: 1rem;

  &:hover {
    color: #DFB163;
  }
`;

const SearchInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 991px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    background-color: #343a40;
    padding: 1rem;
  }
`;

const MobileNavItem = styled(Link)`
  color: white;
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;

  &:hover {
    color: #DFB163;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 1rem; /* Añadido para mover el icono más a la derecha */

  .dropdown-menu {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    background-color: #343a40;
    min-width: 160px;
    z-index: 1;
    right: 0;
    top: 100%; /* Ajusta la posición del menú desplegable */
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    color: #DFB163;
    background-color: #343a40;
    border: none;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: #DFB163;
    }
  }

  .dropdown-item:not(:last-child) {
    margin-bottom: 0.5rem; /* Añade separación entre los elementos del menú desplegable */
  }
`;

const NavBarEstudiante = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      navigate(`/estudiante/dashboard?query=${searchQuery}`);
    }
  };

  return (
    <NavBarContainer>
      <Container>
        <Brand to="/estudiante/dashboard">
          <span className="text-primary">RIO</span>ARRIENDOS
        </Brand>
        <NavbarToggler onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </NavbarToggler>
        <NavItems>
          <SearchInput
            type="text"
            placeholder="Buscar departamentos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <NavItem to="/estudiante/MisFavoritos">Favoritos</NavItem>
          <NavItem to="/estudiante/dashboard">Anuncios</NavItem>
          <NavItem to="/mis-solicitudes">Solicitud de Visita</NavItem>
          <NavItem to="/estudiante/mis-arriendos/">Mi Arriendo</NavItem>
          <DropdownContainer isOpen={dropdownOpen}>
            <FaUserCircle size={24} color="#DFB163" onClick={toggleDropdown} /> {/* Cambia el color a amarillo */}
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate('/perfil')}>Mi Perfil</button>
              <button className="dropdown-item" onClick={handleLogout}>Salir</button>
            </div>
          </DropdownContainer>
        </NavItems>
      </Container>
      <MobileMenu isOpen={isOpen}>
        <MobileNavItem to="/estudiante/MisFavoritos" onClick={toggleMenu}>Favoritos</MobileNavItem>
        <MobileNavItem to="/estudiante/dashboard" onClick={toggleMenu}>Anuncios</MobileNavItem>
        <MobileNavItem to="/mis-solicitudes" onClick={toggleMenu}>Solicitud de Visita</MobileNavItem>
        <MobileNavItem to="/estudiante/mis-arriendos/" onClick={toggleMenu}>Mi Arriendo</MobileNavItem>
        <MobileNavItem to="/perfil" onClick={toggleMenu}>Mi Perfil</MobileNavItem>
        <MobileNavItem as="button" onClick={() => { handleLogout(); toggleMenu(); }}>Salir</MobileNavItem>
      </MobileMenu>
    </NavBarContainer>
  );
};

export default NavBarEstudiante;
