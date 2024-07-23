import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const NavBarContainer = styled.div`
  background-color: ${({ scrolled }) => (scrolled ? '#343a40' : 'transparent')};
  padding: 0.5rem 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1050; /* Asegúrate de que sea mayor que cualquier otro elemento */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${({ scrolled }) => (scrolled ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none')};
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
  color: ${({ scrolled }) => (scrolled ? 'white' : 'white')};
  text-decoration: none;
`;

const NavbarToggler = styled.button`
  background: none;
  border: none;
  color: ${({ scrolled }) => (scrolled ? 'white' : 'white')};
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
  color: ${({ scrolled }) => (scrolled ? 'white' : 'white')};
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
    position: absolute; /* Añadir posición absoluta */
    top: 100%; /* Asegurar que esté debajo de la navbar */
    left: 0;
    right: 0;
    z-index: 1040; /* Asegúrate de que sea menor que el z-index de la navbar */
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

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
        <Brand to="/" scrolled={scrolled}>
          <span className="text-primary">RIO</span>ARRIENDOS
        </Brand>
        <NavbarToggler onClick={toggleMenu} scrolled={scrolled}>
          <i className="fas fa-bars"></i>
        </NavbarToggler>
        <NavItems>
          <NavItem to="/login" scrolled={scrolled}>Iniciar Sesion</NavItem>
          <NavItem to="/signup" scrolled={scrolled}>Registrarse</NavItem>
        </NavItems>
      </Container>
      <MobileMenu isOpen={isOpen}>
        <MobileNavItem to="/login" onClick={toggleMenu}>Iniciar Sesion</MobileNavItem>
        <MobileNavItem to="/signup" onClick={toggleMenu}>Registrarse</MobileNavItem>
      </MobileMenu>
    </NavBarContainer>
  );
};

export default NavBar;
