import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarArrendador from "./NavBarArrendador";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import { FaEdit, FaTrash, FaEye, FaCheck } from 'react-icons/fa';

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
  position: relative; /* Ensures the overlay can be positioned absolutely within this container */
`;

const Card = styled.div`
  position: relative; /* Ensure that the overlay can be positioned absolutely within this container */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: opacity 0.3s ease; /* Smooth transition for image */
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease; /* Smooth transition for overlay */
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
  }

  &:hover .overlay {
    opacity: 1; /* Show overlay on hover */
  }

  .overlay h5 {
    color: white; /* Ensure the text is white */
    margin-bottom: 10px; /* Add margin to the bottom */
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
    background: none; /* Remove background */
    border: none; /* Remove border */
    color: white; /* Default color */
    font-size: 24px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #ccc; /* Lighten the color on hover */
    }

    &.btn-warning {
      color: #ffc107; /* Color for warning icon */
    }

    &.btn-danger {
      color: #dc3545; /* Color for danger icon */
    }

    &.btn-primary {
      color: #007bff; /* Color for primary icon */
    }

    &.btn-success {
      color: #28a745; /* Color for success icon */
    }
  }
`;

const MisDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;
        const response = await axios.get(
          `http://localhost:3000/departamentos/arrendador/${id_arrendador}`
        );
        setDepartamentos(response.data);
      } catch (err) {
        console.error("Error fetching departamentos:", err);
      }
    };
    fetchDepartamentos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/departamentos/${id}`);
      setDepartamentos(departamentos.filter((depto) => depto.id_departamento !== id));
    } catch (err) {
      console.error("Error deleting departamento:", err);
    }
  };

  const handleSolicitarActivacion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const id_arrendador = decoded.id;

      await axios.post(
        "http://localhost:3000/solicitudes-activacion",
        { id_arrendador, id_departamento: id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Solicitud de activación enviada");
    } catch (err) {
      console.error("Error al solicitar activación:", err);

      if (err.response && err.response.data && err.response.data.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("Error al solicitar activación");
      }
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarArrendador />
      <Container>
        <Title>Mis Departamentos</Title>
        <Row>
          {departamentos.map((departamento) => (
            <Col key={departamento.id_departamento}>
              <Card>
                <img
                  src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl}
                  alt={departamento.nombre}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = defaultImageUrl;
                  }}
                />
                <div className="overlay">
                  <h5>{departamento.nombre}</h5>
                  <ButtonRow>
                    <Link to={`/departamentos/editar/${departamento.id_departamento}`} className="icon-button btn-warning"><FaEdit /></Link>
                    <span className="icon-button btn-danger" onClick={() => handleDelete(departamento.id_departamento)}><FaTrash /></span>
                    <Link to={`./${departamento.id_departamento}`} className="icon-button btn-primary"><FaEye /></Link>
                    <span className="icon-button btn-success" onClick={() => handleSolicitarActivacion(departamento.id_departamento)}><FaCheck /></span>
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

export default MisDepartamentos;
