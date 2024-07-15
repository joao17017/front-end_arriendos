import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarArrendador from "./NavBarArrendador";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
`;

const Card = styled.div`
  background-color: #DFB163;
  border: 2px solid black;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 2px solid black;
  }

  .card-body {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h5 {
      margin-bottom: 10px;
    }

    p {
      flex: 1;
    }
  }

  .card-footer {
    background-color: #252531;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  button, .nav-link {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    color: white;

    &:hover {
      opacity: 0.9;
    }

    &.btn-primary {
      background-color: #007bff;

      &:hover {
        background-color: #0056b3;
      }
    }

    &.btn-danger {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }
    }

    &.btn-warning {
      background-color: #ffc107;
      color: black;

      &:hover {
        background-color: #e0a800;
      }
    }

    &.btn-success {
      background-color: #28a745;

      &:hover {
        background-color: #218838;
      }
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
                <div className="card-body">
                  <h5 className="card-title">{departamento.nombre}</h5>
                  <p className="card-text">{departamento.descripcion}</p>
                </div>
                <div className="card-footer">
                  <ButtonRow>
                    <Link to={`/departamentos/editar/${departamento.id_departamento}`} className="nav-link btn-warning">Editar</Link>
                    <button className="btn-danger" onClick={() => handleDelete(departamento.id_departamento)}>Eliminar</button>
                    <Link to={`./${departamento.id_departamento}`} className="nav-link btn-primary">Ver</Link>
                    <button className="btn-success" onClick={() => handleSolicitarActivacion(departamento.id_departamento)}>Solicitar</button>
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
