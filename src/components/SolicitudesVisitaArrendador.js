import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NavBarArrendador from "./NavBarArrendador";
import styled from 'styled-components';
import Modal from 'react-modal';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Dashboard = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-10px);
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #007bff;
`;

const CardText = styled.p`
  margin: 5px 0;
  color: #555;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const Button = styled.button`
  background: ${(props) => props.color || "#007bff"};
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: ${(props) => props.hoverColor || "#0056b3"};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  background: ${(props) => (props.active ? '#007bff' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#007bff')};
  border: 1px solid #ccc;
  border-bottom: none;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.active ? '#0056b3' : '#f0f0f0')};
  }
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
`;

const CommentCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const ModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
};

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="#ffd700" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} color="#ffd700" />);
    } else {
      stars.push(<FaRegStar key={i} color="#ffd700" />);
    }
  }
  return <div>{stars}</div>;
};

const SolicitudesVisitaArrendador = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [modalType, setModalType] = useState("");
  const [comentarioArrendador, setComentarioArrendador] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [comentariosModalIsOpen, setComentariosModalIsOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [activeTab, setActiveTab] = useState('aau');
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const openComentariosModal = async (id_usuario) => {
    setComentariosModalIsOpen(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const endpoint = `http://localhost:3000/comentarios/usuario/${id_usuario}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComentarios(response.data);
    } catch (err) {
      console.error('Error fetching comentarios:', err);
      setError('Error al obtener los comentarios');
    }
  };

  const closeComentariosModal = () => {
    setComentariosModalIsOpen(false);
  };

  return (
    <div>
      <br></br>
      <NavBarArrendador />
      <br></br>
      <Dashboard>
        <h1>Solicitudes de Visita Recibidas</h1>
        <p>
          Estas son las solicitudes de visita que has recibido para tus
          departamentos.
        </p>
        <CardsContainer>
          {solicitudes.map((solicitud) => (
            <Card key={solicitud.id_solicitud_visita}>
              {solicitud.DepartamentoActivo ? (
                <>
                  <CardTitle>{solicitud.DepartamentoActivo.Departamento.nombre}</CardTitle>
                  <CardImage
                    src={solicitud.DepartamentoActivo.Departamento.imagen ? `http://localhost:3000/${solicitud.DepartamentoActivo.Departamento.imagen}` : defaultImageUrl}
                    alt={solicitud.DepartamentoActivo.Departamento.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImageUrl;
                    }}
                  />
                  <CardText><strong>Descripción:</strong> {solicitud.DepartamentoActivo.Departamento.descripcion}</CardText>
                  <CardText><strong>Departamento:</strong> {solicitud.DepartamentoActivo.id_departamento}</CardText>
                  <CardText><strong>Nombre Usuario:</strong> {solicitud.Usuario.nombres}</CardText>
                  <CardText><strong>Estado:</strong> {solicitud.estado}</CardText>
                  <CardText><strong>Fecha Solicitada:</strong> {formatFecha(solicitud.fecha_solicitada)}</CardText>
                  <CardText><strong>Comentario Usuario:</strong> {solicitud.comentario}</CardText>
                  <CardText><strong>Comentario Arrendador:</strong> {solicitud.comentario_arrendador}</CardText>
                  <Button color="#28a745" hoverColor="#218838" onClick={() => openComentariosModal(solicitud.id_usuario)}>Ver Comentarios del Usuario</Button>
                  {solicitud.estado !== "aprobada" && (
                    <Button color="#007bff" hoverColor="#0056b3" onClick={() => openModal(solicitud, "aprobar")}>Aprobar Solicitud</Button>
                  )}
                  {solicitud.estado !== "rechazada" && (
                    <Button color="#dc3545" hoverColor="#c82333" onClick={() => openModal(solicitud, "rechazar")}>Rechazar Solicitud</Button>
                  )}
                  {solicitud.estado !== "postergada" && (
                    <Button color="#ffc107" hoverColor="#e0a800" onClick={() => openModal(solicitud, "postergar")}>Postergar Solicitud</Button>
                  )}
                  <Button color="#17a2b8" hoverColor="#138496" onClick={() => openModal(solicitud, "reprogramar")}>Reprogramar Solicitud</Button>
                  <Button color="#6c757d" hoverColor="#5a6268" onClick={() => handleEliminar(solicitud.id_solicitud_visita)}>Eliminar Solicitud</Button>
                  {solicitud.estado === "aprobada" && (
                    <Button color="#28a745" hoverColor="#218838" onClick={() => handleArrendar(solicitud)}>Arrendar Departamento</Button>
                  )}
                </>
              ) : (
                <p>Departamento no encontrado</p>
              )}
            </Card>
          ))}
        </CardsContainer>
      </Dashboard>

      {selectedSolicitud && (
        <Modal
          isOpen={!!selectedSolicitud}
          onRequestClose={closeModal}
          style={ModalStyles}
          contentLabel="Modal de Solicitud"
        >
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
            <Button color="#007bff" hoverColor="#0056b3" type="submit">Confirmar</Button>
            <Button color="#6c757d" hoverColor="#5a6268" type="button" onClick={closeModal}>Cancelar</Button>
          </form>
        </Modal>
      )}

      <Modal
        isOpen={comentariosModalIsOpen}
        onRequestClose={closeComentariosModal}
        style={ModalStyles}
        contentLabel="Comentarios del Usuario"
      >
        <ModalHeader>
          <Button color="#dc3545" hoverColor="#c82333" onClick={closeComentariosModal}>Cerrar</Button>
          <h2>Comentarios del Usuario</h2>
        </ModalHeader>
        <TabsContainer>
          <Tab active={activeTab === 'aau'} onClick={() => setActiveTab('aau')}>Comentarios Recibidos de Arrendadores</Tab>
          <Tab active={activeTab === 'uaa'} onClick={() => setActiveTab('uaa')}>Comentarios Emitidos</Tab>
        </TabsContainer>
        <CommentsContainer>
          {comentarios
            .filter((c) => c.tipo_comentario === activeTab)
            .map((comentario) => (
              <CommentCard key={comentario.id_comentario}>
                <p><strong>Comentario:</strong> {comentario.comentario}</p>
                <p><strong>Estrellas:</strong> <StarRating rating={comentario.estrellas} /></p>
                <p><strong>Fecha:</strong> {comentario.fecha}</p>
                <p><strong>Departamento:</strong> {comentario.Departamento?.nombre}</p>
                <p><strong>Arrendador:</strong> {comentario.Arrendador?.nombres}</p>
                <p><strong>Usuario:</strong> {comentario.Usuario?.nombres}</p>
              </CommentCard>
            ))}
        </CommentsContainer>
      </Modal>
    </div>
  );
};

export default SolicitudesVisitaArrendador;
