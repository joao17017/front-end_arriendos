import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import styled from 'styled-components';
import Footer from './Footer';

// Styled components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const PropertyContainer = styled.div`
  width: 100%;
  padding: 15px;
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
  height: 100%;  /* Asegura que todas las tarjetas tengan la misma altura */
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;  /* Altura fija para las imágenes */
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;  /* Asegura que la imagen cubra el contenedor sin distorsión */
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
  margin-top: auto;  /* Empuja la fila de información al final del contenedor */
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

// Component
const Home = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departamentosPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentosActivos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/departamentos-activos');
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
  }, []);

  const handleDepartamentoClick = () => {
    navigate('/login');
  };

  const indexOfLastDepartamento = currentPage * departamentosPerPage;
  const indexOfFirstDepartamento = indexOfLastDepartamento - departamentosPerPage;
  const currentDepartamentos = departamentos.slice(indexOfFirstDepartamento, indexOfLastDepartamento);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBar />
      <div className="container-fluid p-0" style={{ paddingTop: '60px' }}> {/* Ajusta el padding para la navbar */}
        <div id="header-carousel" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="img/carousel-1.jpg" alt="Image"/>
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: '800px' }}>
                  <h4 className="text-primary text-uppercase font-weight-normal mb-md-3">Bienvenidos a Arriendos Riobamba</h4>
                  <h3 className="display-3 text-white mb-md-4">Encuentra los mejores arriendos en Riobamba</h3>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="img/carousel-2.jpg" alt="Image"/>
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: '800px' }}>
                  <h4 className="text-primary text-uppercase font-weight-normal mb-md-3">Bienvenidos a Arriendos Riobamba</h4>
                  <h3 className="display-3 text-white mb-md-4">Encuentra los mejores arriendos en Riobamba</h3>
                </div>
              </div>
            </div>
          </div>
          <a className="carousel-control-prev" href="#header-carousel" data-slide="prev">
            <div className="btn btn-primary" style={{ width: '45px', height: '45px' }}>
              <span className="carousel-control-prev-icon mb-n2"></span>
            </div>
          </a>
          <a className="carousel-control-next" href="#header-carousel" data-slide="next">
            <div className="btn btn-primary" style={{ width: '45px', height: '45px' }}>
              <span className="carousel-control-next-icon mb-n2"></span>
            </div>
          </a>
        </div>

        <h3 className="text-primary text-uppercase font-weight-normal display-3 text-center my-4">Departamentos</h3>

        {error && <p className="error-message">{error}</p>}
        <div className="container">
          <div className="row">
            {currentDepartamentos.map((departamento) => (
              <PropertyContainer className="col-md-4 mb-4" key={departamento.id_departamento_activo}>
                <PropertyItem>
                  <ImageWrapper>
                    <a href="/login">
                      <PropertyImage 
                        src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl} 
                        alt={departamento.nombre} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = defaultImageUrl;
                        }}
                      />
                    </a>
                  </ImageWrapper>
                  <div className="p-4 pb-0">
                    <Price>{departamento.precio}</Price>
                    <Title href="/login">{departamento.nombre}</Title>
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
            <Button onClick={handleNextPage} disabled={indexOfLastDepartamento >= departamentos.length}>Siguiente</Button>
          </PaginationContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
