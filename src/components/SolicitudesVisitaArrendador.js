import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import NavBarArrendador from "./NavBarArrendador";
import "./SolicitudesVisitaArrendador.css";
import { FaCheck, FaTimes, FaPause, FaRedo, FaTrash, FaHandshake } from "react-icons/fa";

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
      <NavBarArrendador />
      <div className="dashboard">
        <h1>Solicitudes de Visita Recibidas</h1>
        <p>
          Estas son las solicitudes de visita que has recibido para tus
          departamentos.
        </p>
        <div className="cards-container">
          {solicitudes.map((solicitud) => (
            <div
              className={`card ${
                solicitud.estado === "aprobada" ? "aprobada" : ""
              }`}
              key={solicitud.id_solicitud_visita}
            >
              {solicitud.DepartamentoActivo ? (
                <>
                  <h3>{solicitud.DepartamentoActivo.Departamento.nombre}</h3>
                  {solicitud.DepartamentoActivo.Departamento.imagen && (
                    <img
                      src={`http://localhost:3000/${solicitud.DepartamentoActivo.Departamento.imagen}`}
                      alt={solicitud.DepartamentoActivo.Departamento.nombre}
                      className="card-image"
                    />
                  )}
                  <p>
                    <strong>Descripción:</strong>
                    {solicitud.DepartamentoActivo.Departamento.descripcion}
                  </p>
                  <p>
                    <strong>Departamento:</strong>{" "}
                    {solicitud.DepartamentoActivo.id_departamento}
                  </p>
                  <p>
                    <strong>Nombre Usuario:</strong> {solicitud.Usuario.nombres}
                  </p>
                  <p>
                    <strong>Estado:</strong> {solicitud.estado}
                  </p>
                  <p>
                    <strong>Fecha Solicitada:</strong>{" "}
                    {formatFecha(solicitud.fecha_solicitada)}
                  </p>

                  <p>
                    <strong>Comentario Usuario:</strong> {solicitud.comentario}
                  </p>
                  <p>
                    <strong>Comentario Arrendador:</strong>{" "}
                    {solicitud.comentario_arrendador}
                  </p>

                  <div className="button-container">
                    {solicitud.estado !== "aprobada" && (
                      <button
                        onClick={() => openModal(solicitud, "aprobar")}
                        className="button aprobar-button"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {solicitud.estado !== "rechazada" && (
                      <button
                        onClick={() => openModal(solicitud, "rechazar")}
                        className="button rechazar-button"
                      >
                        <FaTimes />
                      </button>
                    )}
                    {solicitud.estado !== "postergada" && (
                      <button
                        onClick={() => openModal(solicitud, "postergar")}
                        className="button postergar-button"
                      >
                        <FaPause />
                      </button>
                    )}
                    <button
                      onClick={() => openModal(solicitud, "reprogramar")}
                      className="button reprogramar-button"
                    >
                      <FaRedo />
                    </button>
                    <button
                      onClick={() =>
                        handleEliminar(solicitud.id_solicitud_visita)
                      }
                      className="button eliminar-button"
                    >
                      <FaTrash />
                    </button>
                    {solicitud.estado === "aprobada" && (
                      <button
                        onClick={() => handleArrendar(solicitud)}
                        className="button arrendar-button"
                      >
                        <FaHandshake />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <p>Departamento no encontrado</p>
              )}
            </div>
          ))}
        </div>
      </Dashboard>

      {selectedSolicitud && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {modalType.charAt(0).toUpperCase() + modalType.slice(1)} Solicitud
            </h2>
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
              <button type="submit" className="button">
                Confirmar
              </button>
              <button type="button" onClick={closeModal} className="button">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={comentariosModalIsOpen}
        onRequestClose={closeComentariosModal}
        style={ModalStyles}
        contentLabel="Comentarios del Usuario"
      >
        <ModalHeader>
          <button onClick={closeComentariosModal} style={{ backgroundColor: '#dc3545', color: 'white' }}>Cerrar</button>
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
