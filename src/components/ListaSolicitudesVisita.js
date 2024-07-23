import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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
  background: #F3F6FF;
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
    color: #252531;
  }

  p {
    margin-bottom: 0.5rem;
    text-align: center;

    &.label {
      color: #D8A143;
      font-weight: bold;
    }

    &.value {
      color: #252531;
    }
  }

  .info-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    text-align: center;
    width: 100%;
  }

  .info-item {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    &.highlighted {
      color: #D8A143;
    }

    &.normal {
      color: #252531;
    }
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

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  &:hover {
    background-color: #0056b3;
  }
`;

const ListaSolicitudesVisita = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const titleRef = useRef(null);
  const firstCardRef = useRef(null);
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

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleTour = () => {
    const driverObj = driver({
      showProgress: true,
      doneBtnText: 'Hecho',
      closeBtnText: 'Cerrar',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      steps: [
        { element: titleRef.current, popover: { title: 'Mis Solicitudes de Visita', description: 'Aquí puedes ver tus solicitudes de visita.', side: 'bottom' }},
        { element: firstCardRef.current, popover: { title: 'Solicitud de Visita', description: 'Aquí puedes ver la información de una solicitud de visita.', side: 'top' }}
      ]
    });

    driverObj.drive();
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!solicitudes.length) {
    return <p>No hay solicitudes de visita</p>;
  }

  return (
    <div>
      <br></br>
      <NavBarEstudiante />
      <ListaSolicitudesContainer>
        <br></br>
        <h1 ref={titleRef}>Mis Solicitudes de Visita</h1>
        <SolicitudesList>
          {solicitudes.map((solicitud, index) => (
            <SolicitudCard key={solicitud.id_solicitud_visita} ref={index === 0 ? firstCardRef : null}>
              {solicitud.DepartamentoActivo && solicitud.DepartamentoActivo.Departamento ? (
                <>
                  <h3>{solicitud.DepartamentoActivo.Departamento.nombre}</h3>
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
                  <div className="info-container">
                    <div className="info-item">
                      <p className="label">Dirección:</p>
                      <p className="value">{solicitud.DepartamentoActivo.Departamento.direccion}</p>
                    </div>
                    <div className="info-item">
                      <p className="label">Fecha Solicitada:</p>
                      <p className="value">{formatFecha(solicitud.fecha_solicitada)}</p>
                    </div>
                    <div className="info-item">
                      <p className="label">Estado:</p>
                      <p className="value">{solicitud.estado}</p>
                    </div>
                    <div className="info-item">
                      <p className="label">Comentario:</p>
                      <p className="value">{solicitud.comentario}</p>
                    </div>
                    <div className="info-item">
                      <p className="label">Comentario Arrendador:</p>
                      <p className="value">{solicitud.comentario_arrendador}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>Departamento no encontrado</p>
              )}
            </SolicitudCard>
          ))}
        </SolicitudesList>
      </ListaSolicitudesContainer>
      {/* Botón flotante para iniciar el tour */}
      <FloatingButton onClick={handleTour}>
        ?
      </FloatingButton>
    </div>
  );
};

export default ListaSolicitudesVisita;
