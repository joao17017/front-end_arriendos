import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBarArrendador from "./NavBarArrendador";
import styled from 'styled-components';

const estadoColores = {
  aprobada: "#c8e6c9", // Verde claro para aprobada
  rechazada: "#ffcdd2", // Rojo claro para rechazada
  postergada: "#fff9c4", // Amarillo claro para postergada
  reprogramada: "#bbdefb", // Azul claro para reprogramada
  default: "#fff" // Blanco para cualquier otro estado
};

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
  background-color: ${props => estadoColores[props.estado] || estadoColores.default};
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

const Button = styled.button`
  color: white;
  font-size: 0.9rem;
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;

  &.aprobar-button {
    background-color: #4caf50;

    &:hover {
      background-color: #388e3c;
    }
  }

  &.rechazar-button {
    background-color: #f44336;

    &:hover {
      background-color: #d32f2f;
    }
  }

  &.postergar-button {
    background-color: #ff9800;

    &:hover {
      background-color: #f57c00;
    }
  }

  &.reprogramar-button {
    background-color: #03a9f4;

    &:hover {
      background-color: #0288d1;
    }
  }

  &.eliminar-button {
    background-color: #9e9e9e;

    &:hover {
      background-color: #757575;
    }
  }

  &.arrendar-button {
    background-color: #8bc34a;

    &:hover {
      background-color: #689f38;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 10px;
      font-weight: bold;
      color: #333;
    }

    input, textarea {
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 100%;
    }

    .button {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }

      &.cancel-button {
        background-color: #f44336;

        &:hover {
          background-color: #d32f2f;
        }
      }
    }
  }
`;

const SolicitudesVisitaArrendador = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [modalType, setModalType] = useState("");
  const [comentarioArrendador, setComentarioArrendador] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const navigate = useNavigate();

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
        const id_arrendador = decoded.id;

        const response = await axios.get(
          `http://localhost:3000/solicitudes-visita/arrendador/${id_arrendador}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSolicitudes(response.data);
      } catch (err) {
        console.error("Error fetching solicitudes de visita:", err);
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      let data = { comentario_arrendador: comentarioArrendador };

      if (action === "postergar" || action === "reprogramar") {
        if (!nuevaFecha) {
          alert("La nueva fecha no puede estar vacía");
          return;
        }
        data = { ...data, fecha_solicitada: nuevaFecha };
      }

      await axios.put(
        `http://localhost:3000/solicitudes-visita/${id}/${action}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSolicitudes(
        solicitudes.map((solicitud) =>
          solicitud.id_solicitud_visita === id
            ? {
                ...solicitud,
                estado:
                  action === "aprobar"
                    ? "aprobada"
                    : action === "rechazar"
                    ? "rechazada"
                    : action === "postergar"
                    ? "postergada"
                    : "reprogramada",
                fecha_solicitada: nuevaFecha || solicitud.fecha_solicitada,
              }
            : solicitud
        )
      );
      closeModal();
    } catch (err) {
      console.error(`Error al ${action} la solicitud de visita:`, err);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/solicitudes-visita/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSolicitudes(
        solicitudes.filter((solicitud) => solicitud.id_solicitud_visita !== id)
      );
    } catch (err) {
      console.error("Error al eliminar la solicitud de visita:", err);
    }
  };

  const handleArrendar = async (solicitud) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/solicitudes-visita/arrendar`,
        {
          id_departamento_activo: solicitud.id_departamento_activo,
          id_usuario: solicitud.id_usuario,
          id_arrendador: solicitud.id_arrendador,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSolicitudes(
        solicitudes.filter(
          (sol) => sol.id_solicitud_visita !== solicitud.id_solicitud_visita
        )
      );
      alert("Departamento arrendado con éxito.");
    } catch (err) {
      console.error("Error al arrendar el departamento:", err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("Error al arrendar el departamento.");
      }
    }
  };

  const openModal = (solicitud, action) => {
    setSelectedSolicitud(solicitud);
    setModalType(action);
  };

  const closeModal = () => {
    setSelectedSolicitud(null);
    setModalType("");
    setComentarioArrendador("");
    setNuevaFecha("");
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarArrendador />
      <Container>
        <Title>Solicitudes de Visita Recibidas</Title>
        <Row>
          {solicitudes.map((solicitud) => (
            <Col key={solicitud.id_solicitud_visita}>
              <Card estado={solicitud.estado}>
                {solicitud.DepartamentoActivo ? (
                  <>
                    <img
                      src={solicitud.DepartamentoActivo.Departamento.imagen ? `http://localhost:3000/${solicitud.DepartamentoActivo.Departamento.imagen}` : defaultImageUrl}
                      alt={solicitud.DepartamentoActivo.Departamento.nombre}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = defaultImageUrl;
                      }}
                    />
                    <div className="card-body">
                      <h5>{solicitud.DepartamentoActivo.Departamento.nombre}</h5>
                      <p><strong>Descripción:</strong> {solicitud.DepartamentoActivo.Departamento.descripcion}</p>
                      <p><strong>Departamento:</strong> {solicitud.DepartamentoActivo.id_departamento}</p>
                      <p><strong>Nombre Usuario:</strong> {solicitud.Usuario.nombres}</p>
                      <p><strong>Estado:</strong> {solicitud.estado}</p>
                      <p><strong>Fecha Solicitada:</strong> {new Date(solicitud.fecha_solicitada).toLocaleDateString()}</p>
                      <p><strong>Comentario Usuario:</strong> {solicitud.comentario}</p>
                      <p><strong>Comentario Arrendador:</strong> {solicitud.comentario_arrendador}</p>
                    </div>
                    <div className="card-footer">
                      <Button className="aprobar-button" onClick={() => openModal(solicitud, "aprobar")}>Aprobar</Button>
                      <Button className="rechazar-button" onClick={() => openModal(solicitud, "rechazar")}>Rechazar</Button>
                      <Button className="postergar-button" onClick={() => openModal(solicitud, "postergar")}>Postergar</Button>
                      <Button className="reprogramar-button" onClick={() => openModal(solicitud, "reprogramar")}>Reprogramar</Button>
                      <Button className="eliminar-button" onClick={() => handleEliminar(solicitud.id_solicitud_visita)}>Eliminar</Button>
                      {solicitud.estado === "aprobada" && (
                        <Button className="arrendar-button" onClick={() => handleArrendar(solicitud)}>Arrendar</Button>
                      )}
                    </div>
                  </>
                ) : (
                  <p>Departamento no encontrado</p>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {selectedSolicitud && (
        <Modal>
          <ModalContent>
            <h2>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Solicitud</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAction(selectedSolicitud.id_solicitud_visita, modalType);
              }}
            >
              {(modalType === "postergar" || modalType === "reprogramar") && (
                <>
                  <label htmlFor="nuevaFecha">Nueva Fecha:</label>
                  <input
                    type="date"
                    id="nuevaFecha"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    required
                  />
                </>
              )}
              <label htmlFor="comentarioArrendador">Comentario:</label>
              <textarea
                id="comentarioArrendador"
                value={comentarioArrendador}
                onChange={(e) => setComentarioArrendador(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="button">Confirmar</button>
              <button type="button" onClick={closeModal} className="button cancel-button">Cancelar</button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default SolicitudesVisitaArrendador;
