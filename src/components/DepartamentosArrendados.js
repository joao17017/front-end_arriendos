import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';
import { FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 2rem;
  margin-top: 4rem;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;  /* Cambia la dirección a columna por defecto */
  padding: 5rem 2rem;
  background-color: #F3F6FF;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;  /* Cambia a fila en pantallas grandes */
    justify-content: space-between;
  }
`;

const TextSection = styled.div`
  flex: 1;
  padding-right: 0;  /* Ajuste para el diseño en columna */
  margin-bottom: 2rem;  /* Espaciado en la parte inferior para pantallas pequeñas */

  h6 {
    color: #DFB163;
    font-weight: normal;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  h1 {
    margin-bottom: 2rem;
    color: #252531;
  }

  p {
    margin-bottom: 2rem;
    color: #252531;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;

    li {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;

      h5 {
        margin: 0;
        color: #252531;
        span {
          color: #DFB163;
        }
      }

      i {
        color: #DFB163;
        margin-right: 1rem;
      }
    }
  }

  .btn {
    background-color: #007bff;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background-color: #0056b3;
    }

    &.btn-danger {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }
    }

    &.btn-warning {
      background-color: #ffc107;

      &:hover {
        background-color: #e0a800;
      }
    }
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const ButtonSection = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 10px; /* Espacio entre los botones */

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const DepartamentoCard = ({ departamento, onComentar, onEliminar, onDesocupar }) => {
  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <SectionContainer>
      <TextSection>
        <h6>Departamento Arrendado</h6>
        <h1>{departamento.Departamento.nombre}</h1>
        <p>{departamento.Departamento.descripcion}</p>
        <ul>
          <li>
            <h5><FaAddressCard style={{ color: '#DFB163' }} /> <span>Dirección:</span> {departamento.Departamento.direccion}</h5>
          </li>
          <li>
            <h5><FaHandHoldingUsd style={{ color: '#DFB163' }} /> <span>Arrendado a:</span> {departamento.Usuario.nombres}</h5>
          </li>
          <li>
            <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Arrendado por:</span> {departamento.Arrendador.nombres}</h5>
          </li>
        </ul>
        <ButtonSection>
          <button className="btn btn-primary" onClick={() => onComentar(departamento.id_departamento)}>Comentar</button>
          <button className="btn btn-danger" onClick={() => onEliminar(departamento.id_DepartamentoArrendado)}>Eliminar</button>
          <button className="btn btn-warning" onClick={() => onDesocupar(departamento.id_DepartamentoArrendado)}>Desocupar</button>
        </ButtonSection>
      </TextSection>
      <ImageSection>
        <img
          src={departamento.Departamento.imagen ? `http://localhost:3000/${departamento.Departamento.imagen}` : defaultImageUrl}
          alt={departamento.Departamento.nombre}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImageUrl;
          }}
        />
      </ImageSection>
    </SectionContainer>
  );
};

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

  return (
    <div>
      <NavBarArrendador />
      <MainContainer>
        {departamentos.map((departamento) => (
          <DepartamentoCard
            key={departamento.id_departamento}
            departamento={departamento}
            onComentar={handleComentar}
            onEliminar={handleEliminar}
            onDesocupar={handleDesocupar}
          />
        ))}
      </MainContainer>
    </div>
  );
};

export default DepartamentosArrendados;
