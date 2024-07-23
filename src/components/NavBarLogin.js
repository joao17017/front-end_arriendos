// src/components/NavBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const NavBarContainer = styled.div`
  background-color: #343a40;
  padding: 0.5rem 1rem;
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
  color: white;
  text-decoration: none;

  .text-primary {
    color: #007bff;
  }
`;

const NavbarToggler = styled.button`
  background: none;
  border: none;
  color: white;
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
  color: white;
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
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <NavBarContainer>
      <Container>
        <Brand to="/">
          <span className="text-primary">RIO</span>ARRIENDOS
        </Brand>
        <NavbarToggler onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </NavbarToggler>
        <NavItems>
          <NavItem to="/login">Iniciar Sesion</NavItem>
          <NavItem to="/signup">Registrarse</NavItem>
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