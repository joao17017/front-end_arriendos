import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';

const NavBarContainer = styled.div`
  background-color: #343a40; /* Color de fondo constante */
  padding: 0.5rem 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 2px solid ${({ scrolled }) => (scrolled ? 'black' : 'transparent')}; /* Cambio de borde solo */
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

const MobileNavButton = styled.button`
  background-color: #343a40; /* Fondo del botón */
  color: white; /* Texto blanco */
  border: none;
  padding: 0.5rem 1rem;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #DFB163; /* Color de fondo del botón al pasar el ratón (opcional) */
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  .dropdown-menu {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    background-color: #343a40;
    min-width: 160px;
    z-index: 1;
    right: 0;
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    color: #DFB163; /* Cambia el color a amarillo */
    background-color: #343a40;
    border: none;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: #DFB163;
    }
  }
`;

const NavBarArrendador = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <NavBarContainer scrolled={scrolled}>
      <Container>
        <Brand to="/arrendador/dashboard">
          <span className="text-primary">RIO</span>ARRIENDOS
        </Brand>
        <NavbarToggler onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </NavbarToggler>
        <NavItems>
          <NavItem to="/arrendador/crear-departamento">Crear Departamento</NavItem>
          <NavItem to="/arrendador/mis-departamentos">Departamentos</NavItem>
          <NavItem to="/arrendador/anuncios-por-activar">Anuncios por Activar</NavItem>
          <NavItem to="/arrendador/anuncios-activados">Anuncios Activados</NavItem>
          <NavItem to="/arrendador/solicitudes-visita">Solicitudes de Visita</NavItem>
          <NavItem to="/arrendador/departamentos-arrendados">Departamentos Arrendados</NavItem>
          <DropdownContainer isOpen={dropdownOpen}>
            <FaUserCircle size={24} color="#DFB163" onClick={toggleDropdown} /> {/* Cambia el color a amarillo */}
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate('/mi-perfil')}>Mi Perfil</button>
              <button className="dropdown-item" onClick={handleLogout}>Salir</button>
            </div>
          </DropdownContainer>
        </NavItems>
      </Container>
      <MobileMenu isOpen={isOpen}>
        <MobileNavItem to="/arrendador/crear-departamento" onClick={toggleMenu}>Crear Departamento</MobileNavItem>
        <MobileNavItem to="/arrendador/mis-departamentos" onClick={toggleMenu}>Departamentos</MobileNavItem>
        <MobileNavItem to="/arrendador/anuncios-por-activar" onClick={toggleMenu}>Anuncios por Activar</MobileNavItem>
        <MobileNavItem to="/arrendador/anuncios-activados" onClick={toggleMenu}>Anuncios Activados</MobileNavItem>
        <MobileNavItem to="/arrendador/solicitudes-visita" onClick={toggleMenu}>Solicitudes de Visita</MobileNavItem>
        <MobileNavItem to="/arrendador/departamentos-arrendados" onClick={toggleMenu}>Departamentos Arrendados</MobileNavItem>
        <MobileNavItem to="/mi-perfil/" onClick={toggleMenu}>Mi Perfil</MobileNavItem>
        <MobileNavButton onClick={() => { handleLogout(); toggleMenu(); }}>Salir</MobileNavButton>
      </MobileMenu>
    </NavBarContainer>
  );
};

export default NavBarArrendador;
