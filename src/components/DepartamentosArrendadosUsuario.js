// src/components/DepartamentosArrendados.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBarEstudiante from "./NavBarEstudiante";
import styled from 'styled-components';
import { FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';

// Styled Components
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

// Componente para la Tarjeta de Departamento
const DepartamentoCard = ({ departamento }) => {
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
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/");
          return;
        }

        const decoded = jwtDecode(token);
        const id_usuario = decoded.id;

        const response = await axios.get(
          `http://localhost:3000/estudiantes/mis-arriendos/${id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );

        setDepartamentos(response.data);
      } catch (err) {
        console.error("Error fetching departamentos arrendados:", err);
      }
    };

    fetchDepartamentos();
  }, [navigate]);

  return (
    <div>
      <NavBarEstudiante />
      <MainContainer>
        {departamentos.map((departamento) => (
          <DepartamentoCard
            key={departamento.id_departamento}
            departamento={departamento}
          />
        ))}
      </MainContainer>
    </div>
  );
};

export default DepartamentosArrendados;
