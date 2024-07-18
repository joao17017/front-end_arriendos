import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const NavBarContainer = styled.div`
  background-color: ${({ scrolled }) => (scrolled ? '#343a40' : 'transparent')}; /* Fondo transparente al inicio y sólido al hacer scroll */
  padding: 0.5rem 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${({ scrolled }) => (scrolled ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none')}; /* Sombra solo al hacer scroll */
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
  color: ${({ scrolled }) => (scrolled ? 'white' : 'white')}; /* Azul cuando se hace scroll, blanco antes de hacer scroll */
  text-decoration: none;

  .text-primary {
    color: ${({ scrolled }) => (scrolled ? 'white' : 'white')}; /* Blanco cuando se hace scroll, azul antes de hacer scroll */
  }
`;

const NavbarToggler = styled.button`
  background: none;
  border: none;
  color: ${({ scrolled }) => (scrolled ? 'white' : 'white')}; /* Blanco cuando se hace scroll, azul antes de hacer scroll */
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
  color: ${({ scrolled }) => (scrolled ? 'white' : 'white')}; /* Blanco cuando se hace scroll, azul antes de hacer scroll */
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

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
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
          <NavItem to="/signup" scrolled={scrolled}>Registrase</NavItem>
        </NavItems>
      </Container>
      <MobileMenu isOpen={isOpen}>
        <MobileNavItem to="/login" onClick={toggleMenu}>Iniciar Sesion</MobileNavItem>
        <MobileNavItem to="/signup" onClick={toggleMenu}>Iniciar Sesion</MobileNavItem>
      </MobileMenu>
    </NavBarContainer>
  );
};

export default NavBar;
