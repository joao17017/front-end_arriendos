import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Home.css'; // Importa el archivo CSS para los estilos

const Home = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [error, setError] = useState('');
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

  return (
    <div>
      <NavBar />
      <div className="container-fluid p-0">
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
            {departamentos.map((departamento) => (
              <div className="col-md-4 mb-4" key={departamento.id_departamento_activo}>
                <div
                  className="card"
                  onClick={handleDepartamentoClick}
                >
                  <img 
                    src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : '/images/default-image.png'} 
                    alt={departamento.nombre} 
                    className="card-img-top" 
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
        </div>
      </div>
    </div>
  );
};

export default Home;
