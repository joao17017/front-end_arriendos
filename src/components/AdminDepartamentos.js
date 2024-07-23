// src/components/AdminDepartamentos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarAdministrador from './NavBarAdministrador';
import styled from 'styled-components';
import { FaTrash, FaEye, FaEdit, FaSort, FaSearch } from 'react-icons/fa';

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

const AdminDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/departamentos');
        const departamentosConArrendador = await Promise.all(response.data.map(async departamento => {
          const arrendadorResponse = await axios.get(`http://localhost:3000/arrendadores/${departamento.id_arrendador}`);
          return {
            ...departamento,
            arrendador: arrendadorResponse.data,
          };
        }));
        setDepartamentos(departamentosConArrendador);
        setFilteredDepartamentos(departamentosConArrendador);
      } catch (err) {
        setError('Error al obtener los departamentos');
        console.error(err);
      }
    };

    fetchDepartamentos();
  }, []);

  const handleEliminar = async (id_departamento) => {
    try {
      await axios.delete(`http://localhost:3000/departamentos/${id_departamento}`);
      setDepartamentos(departamentos.filter(departamento => departamento.id_departamento !== id_departamento));
      setFilteredDepartamentos(filteredDepartamentos.filter(departamento => departamento.id_departamento !== id_departamento));
      alert('Departamento eliminado');
    } catch (err) {
      console.error('Error al eliminar el departamento:', err);
    }
  };

  const handleVerDetalles = (id_departamento) => {
    navigate(`/administrador/detalle-departamentos/${id_departamento}`);
  };

  const handleEditar = (id_departamento) => {
    navigate(`/administrador/editar-departamentos/${id_departamento}`);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedDepartamentos = [...filteredDepartamentos].sort((a, b) => {
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
      setFilteredDepartamentos(departamentos);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = departamentos.filter(departamento => {
      const nombre = departamento.nombre.toLowerCase();
      const direccion = departamento.direccion.toLowerCase();
      const descripcion = departamento.descripcion.toLowerCase();
      const precio = departamento.precio.toString();
      const arrendadorNombre = departamento.arrendador ? departamento.arrendador.nombres.toLowerCase() : '';

      return nombre.includes(searchTermLower) ||
        direccion.includes(searchTermLower) ||
        descripcion.includes(searchTermLower) ||
        precio.includes(searchTermLower) ||
        arrendadorNombre.includes(searchTermLower);
    });
    setFilteredDepartamentos(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setFilteredDepartamentos(departamentos);
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
  const currentItems = sortedDepartamentos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedDepartamentos.length / itemsPerPage);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <NavBarAdministrador />
      <Container>
        <Title>Administrar Departamentos</Title>
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
        <Table>
          <thead>
            <tr>
              <th onClick={() => handleSort('nombre')}>Nombre del Departamento <FaSort /></th>
              <th onClick={() => handleSort('direccion')}>Dirección <FaSort /></th>
              <th onClick={() => handleSort('descripcion')}>Descripción <FaSort /></th>
              <th onClick={() => handleSort('precio')}>Precio <FaSort /></th>
              <th onClick={() => handleSort('arrendador')}>Nombre del Arrendador <FaSort /></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(departamento => (
              <tr key={departamento.id_departamento}>
                <td>{departamento.nombre}</td>
                <td>{departamento.direccion}</td>
                <td>{departamento.descripcion}</td>
                <td>${departamento.precio}</td>
                <td>{departamento.arrendador ? departamento.arrendador.nombres : 'N/A'}</td>
                <td>
                  <ActionButton onClick={() => handleVerDetalles(departamento.id_departamento)}><FaEye /></ActionButton>
                  <ActionButton className="delete" onClick={() => handleEliminar(departamento.id_departamento)}><FaTrash /></ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, index) => (
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

export default AdminDepartamentos;
