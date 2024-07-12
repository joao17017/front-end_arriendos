// src/components/EstudianteDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import Filters from './Filters';

const DashboardContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  max-width: 300px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FilterHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const FilterInput = styled.input`
  margin-right: 10px;
`;

const Content = styled.div`
  flex: 3;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EstudianteDashboard = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departamentosPerPage] = useState(10);
  const [filters, setFilters] = useState({
    todos_los_servicios_basicos: false,
    incluye_luz: false,
    incluye_agua: false,
    incluye_telefono: false,
    incluye_internet: false,
    incluye_garaje: false,
    aceptan_gatos: false,
    aceptan_perros: false,
    lavanderia: false,
    precioMin: '',
    precioMax: '',
    tamanoMin: '',
    tamanoMax: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDepartamentosActivos = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query') || '';
        let response;
        if (query) {
          response = await axios.get(`http://localhost:3000/bot/search?query=${query}`);
        } else {
          response = await axios.get('http://localhost:3000/departamentos-activos');
        }
        const departamentosActivos = response.data.map(da => ({
          ...da.Departamento,
          id_departamento_activo: da.id_departamento_activo
        }));
        setDepartamentos(departamentosActivos);
      } catch (err) {
        setError('Error al obtener los departamentos activos');
        console.error(err);
      }
    };

    fetchDepartamentosActivos();
  }, [location.search]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = departamentos;

      // Filtrar por campos booleanos
      Object.keys(filters).forEach((key) => {
        if (filters[key] === true) {
          filtered = filtered.filter((departamento) => departamento[key]);
        }
      });

      // Filtrar por rango de precios
      if (filters.precioMin !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.precio) >= parseFloat(filters.precioMin)
        );
      }

      if (filters.precioMax !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.precio) <= parseFloat(filters.precioMax)
        );
      }

      // Filtrar por rango de tamaño
      if (filters.tamanoMin !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.tamano_m_cuadrados) >= parseFloat(filters.tamanoMin)
        );
      }

      if (filters.tamanoMax !== '') {
        filtered = filtered.filter(
          (departamento) => parseFloat(departamento.tamano_m_cuadrados) <= parseFloat(filters.tamanoMax)
        );
      }

      setFilteredDepartamentos(filtered);
    };

    applyFilters();
  }, [filters, departamentos]);

  const handleDepartamentoClick = (id_departamento_activo) => {
    navigate(`/departamentos/${id_departamento_activo}`);
  };

  const indexOfLastDepartamento = currentPage * departamentosPerPage;
  const indexOfFirstDepartamento = indexOfLastDepartamento - departamentosPerPage;
  const currentDepartamentos = filteredDepartamentos.slice(indexOfFirstDepartamento, indexOfLastDepartamento);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarEstudiante />
      <DashboardContainer>
        <Sidebar>
          <FilterHeader>Filtrar por:</FilterHeader>
          <FilterGroup>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.todos_los_servicios_basicos}
                onChange={() =>
                  setFilters({
                    ...filters,
                    todos_los_servicios_basicos: !filters.todos_los_servicios_basicos
                  })
                }
              />
              Todos los Servicios Básicos
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.incluye_luz}
                onChange={() =>
                  setFilters({
                    ...filters,
                    incluye_luz: !filters.incluye_luz
                  })
                }
              />
              Incluye Luz
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.incluye_agua}
                onChange={() =>
                  setFilters({
                    ...filters,
                    incluye_agua: !filters.incluye_agua
                  })
                }
              />
              Incluye Agua
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.incluye_telefono}
                onChange={() =>
                  setFilters({
                    ...filters,
                    incluye_telefono: !filters.incluye_telefono
                  })
                }
              />
              Incluye Teléfono
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.incluye_internet}
                onChange={() =>
                  setFilters({
                    ...filters,
                    incluye_internet: !filters.incluye_internet
                  })
                }
              />
              Incluye Internet
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.incluye_garaje}
                onChange={() =>
                  setFilters({
                    ...filters,
                    incluye_garaje: !filters.incluye_garaje
                  })
                }
              />
              Incluye Garaje
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.aceptan_gatos}
                onChange={() =>
                  setFilters({
                    ...filters,
                    aceptan_gatos: !filters.aceptan_gatos
                  })
                }
              />
              Aceptan Gatos
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.aceptan_perros}
                onChange={() =>
                  setFilters({
                    ...filters,
                    aceptan_perros: !filters.aceptan_perros
                  })
                }
              />
              Aceptan Perros
            </FilterLabel>
            <FilterLabel>
              <FilterInput
                type="checkbox"
                checked={filters.lavanderia}
                onChange={() =>
                  setFilters({
                    ...filters,
                    lavanderia: !filters.lavanderia
                  })
                }
              />
              Lavandería
            </FilterLabel>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Precio mínimo:</FilterLabel>
            <FilterInput
              type="number"
              value={filters.precioMin}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  precioMin: e.target.value
                })
              }
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Precio máximo:</FilterLabel>
            <FilterInput
              type="number"
              value={filters.precioMax}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  precioMax: e.target.value
                })
              }
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Tamaño mínimo:</FilterLabel>
            <FilterInput
              type="number"
              value={filters.tamanoMin}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tamanoMin: e.target.value
                })
              }
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Tamaño máximo:</FilterLabel>
            <FilterInput
              type="number"
              value={filters.tamanoMax}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tamanoMax: e.target.value
                })
              }
            />
          </FilterGroup>
        </Sidebar>
        <Content>
          <Header>Bienvenidos a Arriendos Riobamba</Header>
          <p>Encuentra los mejores arriendos en Riobamba.</p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <div className="container">
            <div className="row">
              {currentDepartamentos.map((departamento) => (
                <div className="col-md-4 mb-4" key={departamento.id_departamento_activo}>
                  <div
                    className="card"
                    onClick={() => handleDepartamentoClick(departamento.id_departamento_activo)}
                  >
                    <img 
                      src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl} 
                      alt={departamento.nombre} 
                      className="card-img-top" 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = defaultImageUrl;
                      }}
                    />
                    <div className="card-body bg-white p-4">
                      <div className="d-flex align-items-center mb-3">
                        <h5 className="m-0 ml-3 text-truncate">{departamento.nombre}</h5>
                      </div>
                      <p><strong>Dirección:</strong> {departamento.direccion}</p>
                      <p><strong>Precio:</strong> {departamento.precio}</p>
                      <p><strong>Descripción:</strong> {departamento.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaginationContainer>
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</Button>
              <Button onClick={handleNextPage} disabled={indexOfLastDepartamento >= filteredDepartamentos.length}>Siguiente</Button>
            </PaginationContainer>
          </div>
        </Content>
      </DashboardContainer>
    </div>
  );
};

export default EstudianteDashboard;
