import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import styled from "styled-components";
import NavBarEstudiante from "./NavBarEstudiante";

const ListaSolicitudesContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
`;

const SolicitudesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const SolicitudCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 1rem;
  }

  @media (min-width: 768px) {
    width: calc(50% - 2rem);
  }

  @media (min-width: 1024px) {
    width: calc(33.33% - 2rem);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 2rem;
`;

const ListaSolicitudesVisita = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate("/");
          return;
        }

        const decoded = jwtDecode(token);
        setUsuario(decoded);

        const response = await axios.get(
          `http://localhost:3000/solicitudes-visita/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSolicitudes(response.data);
      } catch (err) {
        console.error("Error fetching solicitudes de visita:", err);
        setError("Error al obtener las solicitudes de visita");
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!solicitudes.length) {
    return <p>No hay solicitudes de visita</p>;
  }

  return (
    <div>
      <NavBarEstudiante />
      <ListaSolicitudesContainer>
        <br></br>
        <h1>Mis Solicitudes de Visita</h1>
        <SolicitudesList>
          {solicitudes.map((solicitud) => (
            <SolicitudCard key={solicitud.id_solicitud_visita}>
              {solicitud.DepartamentoActivo && solicitud.DepartamentoActivo.Departamento ? (
                <>
                  <h3>{solicitud.DepartamentoActivo.Departamento.nombre}</h3>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {solicitud.DepartamentoActivo.Departamento.direccion}
                  </p>
                  <p>
                    <strong>Fecha Solicitada:</strong>{" "}
                    {new Date(solicitud.fecha_solicitada).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Estado:</strong> {solicitud.estado}
                  </p>
                  <p>
                    <strong>Comentario:</strong> {solicitud.comentario}
                  </p>
                  <p>
                    <strong>Comentario Arrendador:</strong> {solicitud.comentario_arrendador}
                  </p>
                  <img
                    src={
                      solicitud.DepartamentoActivo.Departamento.imagen
                        ? `http://localhost:3000/${solicitud.DepartamentoActivo.Departamento.imagen}`
                        : defaultImageUrl
                    }
                    alt={solicitud.DepartamentoActivo.Departamento.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImageUrl;
                    }}
                  />
                </>
              ) : (
                <p>Departamento no encontrado</p>
              )}
            </SolicitudCard>
          ))}
        </SolicitudesList>
      </ListaSolicitudesContainer>
    </div>
  );
};

export default ListaSolicitudesVisita;
