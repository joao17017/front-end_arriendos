// src/components/NavBarEstudiante.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';

// Styled components
const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 10px;
  position: relative;
`;

const NavbarBrand = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 24px;
`;

const NavbarButtons = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    background-color: #333;
    position: absolute;
    top: 60px;
    right: 0;
    width: 100%;
    z-index: 1;
  }
`;

const NavbarButton = styled.button`
  background: none;
  color: #fff;
  border: none;
  margin: 0 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const SearchInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const NavbarAccount = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  z-index: 10;
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: #f0f0f0;
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

  @media (min-width: 769px) {
    display: none;
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
    <Navbar>
      <NavbarBrand to="/estudiante/dashboard">
        Arriendos Riobamba
      </NavbarBrand>
      <NavbarToggler onClick={toggleMenu}>
        <i className="fas fa-bars"></i>
      </NavbarToggler>
      <NavbarButtons isOpen={isOpen}>
        <SearchInput
          type="text"
          placeholder="Buscar departamentos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <NavbarButton onClick={() => navigate('/estudiante/MisFavoritos')}>
          Favoritos
        </NavbarButton>
        <NavbarButton onClick={() => navigate('/estudiante/dashboard')}>
          Anuncios
        </NavbarButton>
        <NavbarButton onClick={() => navigate('/mis-solicitudes')}>
          Solicitud de Visita
        </NavbarButton>
        <NavbarButton onClick={() => navigate('/estudiante/mis-arriendos/')}>
          Mi Arriendo
        </NavbarButton>
        <NavbarAccount onClick={toggleDropdown}>
          <FaUserCircle size={24} />
          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={() => navigate('/mi-perfil/')}>
                Mi Perfil
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                Salir
              </DropdownItem>
            </DropdownMenu>
          )}
        </NavbarAccount>
      </NavbarButtons>
    </Navbar>
  );
};

export default NavBarEstudiante;
