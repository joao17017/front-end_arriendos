// src/components/AdminUsuarios.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarAdministrador from './NavBarAdministrador';
import styled from 'styled-components';
import { FaTrash, FaEdit, FaSort, FaSearch } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px; /* Ajusta según la altura de tu NavBar */
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 12px 15px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f8f9fa;
    cursor: pointer;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  padding: 8px 12px;
  font-size: 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    color: #0056b3;
  }

  &.delete {
    color: #dc3545;

    &:hover {
      color: #c82333;
    }
  }

  &.edit {
    color: #ffc107;

    &:hover {
      color: #e0a800;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: ${props => (props.active ? '#007bff' : '#f8f9fa')};
  color: ${props => (props.active ? 'white' : '#007bff')};
  border: 1px solid #007bff;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${props => (props.active ? '#0056b3' : '#e2e6ea')};
  }
`;

const AdminUsuarios = () => {
  const [arrendadores, setArrendadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filteredArrendadores, setFilteredArrendadores] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const arrendadoresResponse = await axios.get('http://localhost:3000/arrendadores');
        setArrendadores(arrendadoresResponse.data);
        setFilteredArrendadores(arrendadoresResponse.data);

        const usuariosResponse = await axios.get('http://localhost:3000/estudiantes');
        setUsuarios(usuariosResponse.data);
        setFilteredUsuarios(usuariosResponse.data);
      } catch (err) {
        setError('Error al obtener los datos');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleEliminarArrendador = async (id_arrendador) => {
    try {
      await axios.delete(`http://localhost:3000/arrendadores/${id_arrendador}`);
      setArrendadores(arrendadores.filter(arrendador => arrendador.id_arrendador !== id_arrendador));
      setFilteredArrendadores(filteredArrendadores.filter(arrendador => arrendador.id_arrendador !== id_arrendador));
      alert('Arrendador eliminado');
    } catch (err) {
      console.error('Error al eliminar el arrendador:', err);
    }
  };

  const handleEliminarUsuario = async (id_usuario) => {
    try {
      await axios.delete(`http://localhost:3000/estudiantes/${id_usuario}`);
      setUsuarios(usuarios.filter(usuario => usuario.id_usuario !== id_usuario));
      setFilteredUsuarios(filteredUsuarios.filter(usuario => usuario.id_usuario !== id_usuario));
      alert('Usuario eliminado');
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);
    }
  };

 

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedArrendadores = [...filteredArrendadores].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredArrendadores(arrendadores);
      setFilteredUsuarios(usuarios);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();

    const filteredA = arrendadores.filter(arrendador => {
      const { RUC, nombres, email, telefono, direccion } = arrendador;
      return (
        RUC.toLowerCase().includes(searchTermLower) ||
        nombres.toLowerCase().includes(searchTermLower) ||
        email.toLowerCase().includes(searchTermLower) ||
        telefono.toLowerCase().includes(searchTermLower) ||
        direccion.toLowerCase().includes(searchTermLower)
      );
    });

    const filteredU = usuarios.filter(usuario => {
      const { nombres, cedula, telefono, email, universidad } = usuario;
      return (
        nombres.toLowerCase().includes(searchTermLower) ||
        cedula.toLowerCase().includes(searchTermLower) ||
        telefono.toLowerCase().includes(searchTermLower) ||
        email.toLowerCase().includes(searchTermLower) ||
        universidad.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredArrendadores(filteredA);
    setFilteredUsuarios(filteredU);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setFilteredArrendadores(arrendadores);
    setFilteredUsuarios(usuarios);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Backspace' && searchTerm.length === 1) {
      handleResetSearch();
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItemsArrendadores = sortedArrendadores.slice(startIndex, endIndex);
  const currentItemsUsuarios = sortedUsuarios.slice(startIndex, endIndex);
  const totalPagesArrendadores = Math.ceil(sortedArrendadores.length / itemsPerPage);
  const totalPagesUsuarios = Math.ceil(sortedUsuarios.length / itemsPerPage);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <NavBarAdministrador />
      <Container>
        <Title>Administrar Usuarios</Title>
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="Buscar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}><FaSearch /></SearchButton>
          <SearchButton onClick={handleResetSearch}>Restablecer</SearchButton>
        </SearchContainer>
        <h2>Arrendadores</h2>
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort('RUC')}>RUC <FaSort /></th>
              <th onClick={() => handleSort('nombres')}>Nombres <FaSort /></th>
              <th onClick={() => handleSort('email')}>Email <FaSort /></th>
              <th onClick={() => handleSort('telefono')}>Teléfono <FaSort /></th>
              <th onClick={() => handleSort('direccion')}>Dirección <FaSort /></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItemsArrendadores.map(arrendador => (
              <tr key={arrendador.id_arrendador}>
                <td>{arrendador.RUC}</td>
                <td>{arrendador.nombres}</td>
                <td>{arrendador.email}</td>
                <td>{arrendador.telefono}</td>
                <td>{arrendador.direccion}</td>
                <td>
                  <ActionButton className="delete" onClick={() => handleEliminarArrendador(arrendador.id_arrendador)}><FaTrash /></ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationContainer>
          {Array.from({ length: totalPagesArrendadores }, (_, index) => (
            <PaginationButton
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              active={index + 1 === currentPage}
            >
              {index + 1}
            </PaginationButton>
          ))}
        </PaginationContainer>

        <h2>Usuarios/Estudiantes</h2>
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort('nombres')}>Nombres <FaSort /></th>
              <th onClick={() => handleSort('cedula')}>Cédula <FaSort /></th>
              <th onClick={() => handleSort('telefono')}>Teléfono <FaSort /></th>
              <th onClick={() => handleSort('email')}>Email <FaSort /></th>
              <th onClick={() => handleSort('universidad')}>Universidad <FaSort /></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItemsUsuarios.map(usuario => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.nombres}</td>
                <td>{usuario.cedula}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.email}</td>
                <td>{usuario.universidad}</td>
                <td>
                  <ActionButton className="delete" onClick={() => handleEliminarUsuario(usuario.id_usuario)}><FaTrash /></ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationContainer>
          {Array.from({ length: totalPagesUsuarios }, (_, index) => (
            <PaginationButton
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              active={index + 1 === currentPage}
            >
              {index + 1}
            </PaginationButton>
          ))}
        </PaginationContainer>
      </Container>
    </div>
  );
};

export default AdminUsuarios;
