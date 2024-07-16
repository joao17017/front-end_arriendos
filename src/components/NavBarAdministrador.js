import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import axios from 'axios';
import styled from 'styled-components';

Modal.setAppElement('#root');

const NavBarContainer = styled.div`
  background-color: #343a40;
  padding: 0.5rem 1rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 2px solid ${({ scrolled }) => (scrolled ? 'black' : 'transparent')};
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

const NavItemButton = styled.button`
  color: white;
  background: none;
  border: none;
  margin-left: 1rem;
  cursor: pointer;

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
    color: #DFB163;
    background-color: #343a40;
    border: none;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: #DFB163;
    }
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const NavBarAdministrador = ({ onGestionarUsuariosClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/buscar?query=${searchQuery}`);
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
        <Brand to="/administrador/dashboard">
          <span className="text-primary">Arriendos</span> Riobamba
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
          <NavItem to="#" onClick={() => navigate('#')}>Gestionar Departamentos</NavItem>
          <NavItem to="/administrador/lista-solicitudes">Administrar Solicitudes</NavItem>
          <NavItemButton onClick={onGestionarUsuariosClick}>Gestionar Usuarios</NavItemButton>
          <DropdownContainer isOpen={dropdownOpen}>
            <FaUserCircle size={24} color="#DFB163" onClick={toggleDropdown} />
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate('/mi-perfil/')}>Mi Perfil</button>
              <button className="dropdown-item" onClick={handleLogout}>Salir</button>
            </div>
          </DropdownContainer>
        </NavItems>
      </Container>
      <MobileMenu isOpen={isOpen}>
        <MobileNavItem to="#" onClick={toggleMenu}>Gestionar Departamentos</MobileNavItem>
        <MobileNavItem to="/administrador/lista-solicitudes" onClick={toggleMenu}>Administrar Solicitudes</MobileNavItem>
        <MobileNavItem as="button" onClick={() => { onGestionarUsuariosClick(); toggleMenu(); }}>Gestionar Usuarios</MobileNavItem>
        <MobileNavItem to="/mi-perfil/" onClick={toggleMenu}>Mi Perfil</MobileNavItem>
        <MobileNavItem as="button" onClick={() => { handleLogout(); toggleMenu(); }}>Salir</MobileNavItem>
      </MobileMenu>
    </NavBarContainer>
  );
};

export default NavBarAdministrador;
