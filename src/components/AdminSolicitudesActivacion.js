import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarAdministrador from './NavBarAdministrador';
import styled from 'styled-components';
import { FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const NavBarHeight = '60px'; // Ajusta este valor según el alto real de tu NavBar

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: ${NavBarHeight}; /* Añadir margen superior igual al alto de la NavBar */
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Col = styled.div`
  flex: 1 1 300px;
  max-width: 300px;
  position: relative; /* Asegura que la superposición se posicione dentro de este contenedor */
`;

const Card = styled.div`
  position: relative; /* Asegura que la superposición se posicione dentro de este contenedor */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: opacity 0.3s ease; /* Transición suave para la imagen */
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Fondo negro semitransparente */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease; /* Transición suave para la superposición */
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
  }

  &:hover .overlay {
    opacity: 1; /* Mostrar la superposición al pasar el ratón */
  }

  .overlay h5 {
    color: white; /* Asegura que el texto sea blanco */
    margin-bottom: 10px; /* Añade margen en la parte inferior */
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
  justify-content: center;

  .icon-button {
    background: none; /* Elimina el fondo */
    border: none; /* Elimina el borde */
    color: white; /* Color predeterminado */
    font-size: 24px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #ccc; /* Aclarar el color al pasar el ratón */
    }

    &.btn-warning {
      color: #ffc107; /* Color para el ícono de advertencia */
    }

    &.btn-danger {
      color: #dc3545; /* Color para el ícono de peligro */
    }

    &.btn-primary {
      color: #007bff; /* Color para el ícono principal */
    }

    &.btn-success {
      color: #28a745; /* Color para el ícono de éxito */
    }
  }
`;

const AdminSolicitudesActivacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/solicitudes-activacion');
        setSolicitudes(response.data);
      } catch (err) {
        setError('Error al obtener las solicitudes de activación');
        console.error(err);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleAprobar = async (id_solicitud) => {
    try {
      await axios.put(`http://localhost:3000/solicitudes-activacion/${id_solicitud}/aprobar`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud !== id_solicitud));
      alert('Solicitud aprobada');
    } catch (err) {
      console.error('Error al aprobar solicitud:', err);
    }
  };

  const handleEliminar = async (id_solicitud) => {
    try {
      await axios.delete(`http://localhost:3000/solicitudes-activacion/${id_solicitud}`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud !== id_solicitud));
      alert('Solicitud eliminada');
    } catch (err) {
      console.error('Error al eliminar solicitud:', err);
    }
  };

  const handleDesaprobar = async (id_solicitud) => {
    try {
      await axios.put(`http://localhost:3000/solicitudes-activacion/${id_solicitud}/desaprobar`);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id_solicitud !== id_solicitud));
      alert('Solicitud desaprobada');
    } catch (err) {
      console.error('Error al desaprobar solicitud:', err);
    }
  };

  const handleVerDetalles = (id_departamento) => {
    console.log("Redirigiendo al departamento con id:", id_departamento); // Agrega esta línea
    navigate(`/departamentos/${id_departamento}`);
  };

  const handleImageError = (e) => {
    e.target.src = '/img/carousel-2.jpg'; // Ruta de la imagen por defecto
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <NavBarAdministrador />
      <Container>
        <Title>Administrar Solicitudes de Activación</Title>
        <Row>
          {solicitudes.map(solicitud => (
            <Col key={solicitud.id_solicitud}>
              <Card>
                <img 
                  src={`http://localhost:3000/${solicitud.Departamento.imagen}`} 
                  alt={solicitud.Departamento.nombre}
                  onError={handleImageError}
                />
                <div className="overlay">
                  <h5>{solicitud.Departamento.nombre}</h5>
                  <ButtonRow>
                    <span className="icon-button btn-success" onClick={() => handleAprobar(solicitud.id_solicitud)}><FaCheck /></span>
                    <span className="icon-button btn-danger" onClick={() => handleEliminar(solicitud.id_solicitud)}><FaTrash /></span>
                    <span className="icon-button btn-primary" onClick={() => handleVerDetalles(solicitud.Departamento.id_departamento)}><FaEye /></span>
                    <span className="icon-button btn-warning" onClick={() => handleDesaprobar(solicitud.id_solicitud)}><FaTimes /></span>
                  </ButtonRow>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminSolicitudesActivacion;
