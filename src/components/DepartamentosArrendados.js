import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';
import { FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: var(--custom-color);
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Col = styled.div`
  flex: 1 1 600px;
  max-width: 600px;
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

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const InfoCol = styled.div`
  flex: 1 1 50%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  h5 {
    margin: 0;
  }

  svg {
    margin-right: 10px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &.btn-primary {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    &.btn-danger {
      background-color: #dc3545;
      color: white;

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
  }
`;

const DepartamentosArrendados = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(`http://localhost:3000/departamentos-arrendados/lista/${id_arrendador}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDepartamentos(response.data);
      } catch (err) {
        console.error('Error fetching departamentos arrendados:', err);
      }
    };

    fetchDepartamentos();
  }, [navigate]);

  const handleComentar = (id_departamento) => {
    console.log('Comentar:', id_departamento);
  };

  const handleEliminar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/departamentos-arrendados/${id_departamento_arrendado}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log('Departamento eliminado:', id_departamento_arrendado);
    } catch (err) {
      console.error('Error eliminando departamento arrendado:', err);
    }
  };

  const handleDesocupar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/departamentos-arrendados/desocupar/${id_departamento_arrendado}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log('Departamento desocupado:', id_departamento_arrendado);
    } catch (err) {
      console.error('Error desocupando departamento arrendado:', err);
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarArrendador />
      <Container>
        <Title>Departamentos Arrendados</Title>
        <Row>
          {departamentos.map((departamento) => (
            <Col key={departamento.id_departamento}>
              <Card>
                <img
                  src={departamento.Departamento.imagen ? `http://localhost:3000/${departamento.Departamento.imagen}` : defaultImageUrl}
                  alt={departamento.Departamento.nombre}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = defaultImageUrl;
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{departamento.Departamento.nombre}</h5>
                  <p className="card-text">{departamento.Departamento.descripcion}</p>
                  <InfoRow>
                    <InfoCol>
                      <FaAddressCard />
                      <h5>Dirección: {departamento.Departamento.direccion}</h5>
                    </InfoCol>
                    <InfoCol>
                      <FaHandHoldingUsd />
                      <h5>Arrendado a: {departamento.Usuario.nombres}</h5>
                    </InfoCol>
                    <InfoCol>
                      <FaUserTie />
                      <h5>Arrendado por: {departamento.Arrendador.nombres}</h5>
                    </InfoCol>
                  </InfoRow>
                </div>
                <div className="card-footer">
                  <ButtonRow>
                    <button className="btn btn-primary" onClick={() => handleComentar(departamento.id_departamento)}>
                      Comentar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(departamento.id_DepartamentoArrendado)}>
                      Eliminar
                    </button>
                    <button className="btn btn-warning" onClick={() => handleDesocupar(departamento.id_DepartamentoArrendado)}>
                      Desocupar
                    </button>
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

export default DepartamentosArrendados;
