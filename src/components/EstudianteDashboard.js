import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';

const DashboardContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 80px;
  background-color: #F3F6FF;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  max-width: 300px;
  margin-bottom: 20px;
  background-color: #DFB163;
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
  display: flex;
  flex-direction: column;
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

const PropertyContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Espacio entre las tarjetas */
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 992px) {
    .col-md-4 {
      width: 33.3333%;
    }
  }

  @media (max-width: 991px) {
    .col-md-6 {
      width: 50%;
    }
  }
`;

const PropertyItem = styled.div`
  border: 2px solid #DFB163;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: auto;
`;

const Price = styled.h5`
  color: #DFB163;
  margin-bottom: 15px;
`;

const Title = styled.a`
  display: block;
  font-size: 1.125rem;
  margin-bottom: 10px;
  color: #333;
  text-decoration: none;

  &:hover {
    color: #DFB163;
  }
`;

const Address = styled.p`
  font-size: 0.875rem;
  color: #666;
`;

const InfoRow = styled.div`
  display: flex;
  border-top: 2px solid #DFB163;
`;

const InfoItem = styled.small`
  flex: 1;
  text-align: center;
  border-right: 2px solid #DFB163;
  padding: 10px;
  color: #333;
  font-size: 0.875rem;

  &:last-child {
    border-right: none;
  }

  i {
    color: #DFB163;
    margin-right: 5px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  padding-top: 10px;
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
  const [showModal, setShowModal] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
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
          setSearchPerformed(true);
        } else {
          response = await axios.get('http://localhost:3000/departamentos-activos');
          setSearchPerformed(false);
        }
        const departamentosActivos = response.data.map(da => ({
          ...da.Departamento,
          id_departamento_activo: da.id_departamento_activo
        }));
        setDepartamentos(departamentosActivos);
        setFilteredDepartamentos(departamentosActivos);
        setShowModal(searchPerformed);
      } catch (err) {
        setError('Error al obtener los departamentos activos');
        console.error(err);
        setShowModal(true);
      }
    };

    fetchDepartamentosActivos();
  }, [location.search]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = departamentos;

      Object.keys(filters).forEach((key) => {
        if (filters[key] === true) {
          filtered = filtered.filter((departamento) => departamento[key]);
        }
      });

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
                <PropertyContainer className="col-md-4 mb-4" key={departamento.id_departamento_activo}>
                  <PropertyItem onClick={() => handleDepartamentoClick(departamento.id_departamento_activo)}>
                    <ImageWrapper>
                      <PropertyImage 
                        src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl} 
                        alt={departamento.nombre} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = defaultImageUrl;
                        }}
                      />
                    </ImageWrapper>
                    <div className="p-4 pb-0">
                      <Price>{departamento.precio}</Price>
                      <Title>{departamento.nombre}</Title>
                      <Address><i className="fa fa-map-marker-alt"></i>{departamento.direccion}</Address>
                    </div>
                    <InfoRow>
                      <InfoItem><i className="fa fa-ruler-combined"></i>{departamento.tamano_m_cuadrados} m²</InfoItem>
                      <InfoItem><i className="fa fa-bed"></i>{departamento.n_habitaciones} habitaciones</InfoItem>
                      <InfoItem><i className="fa fa-bath"></i>{departamento.n_banos} baños</InfoItem>
                    </InfoRow>
                  </PropertyItem>
                </PropertyContainer>
              ))}
            </div>
            <PaginationContainer>
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</Button>
              <Button onClick={handleNextPage} disabled={indexOfLastDepartamento >= filteredDepartamentos.length}>Siguiente</Button>
            </PaginationContainer>
          </div>
        </Content>
      </DashboardContainer>

      {/* Modal para mostrar resultados de búsqueda */}
      {showModal && searchPerformed && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Resultados de Búsqueda</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              {filteredDepartamentos.length > 0 ? (
                <div className="container">
                  <div className="row">
                    {filteredDepartamentos.map((departamento) => (
                      <PropertyContainer className="col-md-4 mb-4" key={departamento.id_departamento_activo}>
                        <PropertyItem onClick={() => handleDepartamentoClick(departamento.id_departamento_activo)}>
                          <ImageWrapper>
                            <PropertyImage 
                              src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl} 
                              alt={departamento.nombre} 
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = defaultImageUrl;
                              }}
                            />
                          </ImageWrapper>
                          <div className="p-4 pb-0">
                            <Price>{departamento.precio}</Price>
                            <Title>{departamento.nombre}</Title>
                            <Address><i className="fa fa-map-marker-alt"></i>{departamento.direccion}</Address>
                          </div>
                          <InfoRow>
                            <InfoItem><i className="fa fa-ruler-combined"></i>{departamento.tamano_m_cuadrados} m²</InfoItem>
                            <InfoItem><i className="fa fa-bed"></i>{departamento.n_habitaciones} habitaciones</InfoItem>
                            <InfoItem><i className="fa fa-bath"></i>{departamento.n_banos} baños</InfoItem>
                          </InfoRow>
                        </PropertyItem>
                      </PropertyContainer>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No se encontraron departamentos que coincidan con la búsqueda.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setShowModal(false)}>Cerrar</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default EstudianteDashboard;
