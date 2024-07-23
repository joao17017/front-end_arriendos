import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import {jwtDecode} from 'jwt-decode';
import Modal from 'react-modal';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const DetallesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 auto;

  img {
    width: 100%;
    border-radius: 8px;
  }

  .solicitar-visita-button,
  .anadir-a-favorito,
  .ver-comentarios-button {
    display: block;
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  .anadir-a-favorito.disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const DetallesContent = styled.div`
  flex: 2;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 10px;
    white-space: pre-wrap;
  }

  strong {
    display: inline-block;
    width: 150px;
    color: #333;
  }
`;

const SolicitudVisitaForm = styled.div`
  margin-top: 20px;

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const Mensaje = styled.p`
  color: green;
  text-align: center;
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

const DepartamentoDetalles = () => {
  const { id } = useParams();
  const [departamento, setDepartamento] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [fechaSolicitada, setFechaSolicitada] = useState('');
  const [comentario, setComentario] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comentariosModalIsOpen, setComentariosModalIsOpen] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [activeTab, setActiveTab] = useState('aau');

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamentos-activos/${id}`);
        setDepartamento(response.data.Departamento);
      } catch (err) {
        setError('Error al obtener el departamento');
        console.error(err);
      }
    };

    fetchDepartamento();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsuario(decoded);

      const verificarFavorito = async () => {
        try {
          const response = await axios.post('http://localhost:3000/favoritos/verificar', {
            id_usuario: decoded.id,
            id_departamento_activo: id,
          });
          setEsFavorito(response.data.favorito);
        } catch (err) {
          console.error('Error al verificar favorito:', err);
        }
      };

      verificarFavorito();
    }
  }, [id]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openComentariosModal = async () => {
    setComentariosModalIsOpen(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const endpoint = `http://localhost:3000/comentarios/arrendador/${departamento.id_arrendador}`;

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

  const handleSolicitudVisita = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para solicitar una visita');
        return;
      }

      const hoy = new Date();
      const fechaMinima = hoy.toISOString().split('T')[0];
      const fechaMaxima = new Date(hoy.setDate(hoy.getDate() + 8)).toISOString().split('T')[0];

      if (fechaSolicitada < fechaMinima || fechaSolicitada > fechaMaxima) {
        setError(`La fecha solicitada debe estar entre hoy y ${fechaMaxima}`);
        return;
      }

      const decoded = jwtDecode(token);
      const id_usuario = decoded.id;
      const response = await axios.post('http://localhost:3000/solicitudes-visita', {
        id_departamento_activo: id,
        id_usuario,
        fecha_solicitada: fechaSolicitada,
        comentario,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Solicitud de visita enviada correctamente');
      closeModal();
      alert('Solicitud de visita enviada correctamente');
    } catch (err) {
      console.error('Error al enviar la solicitud de visita:', err);
      setError(err.response?.data?.error || 'Error al enviar la solicitud de visita');
    }
  };

  const handleAnadirAFavorito = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para añadir a favoritos');
        return;
      }

      const decoded = jwtDecode(token);
      const id_usuario = decoded.id;

      await axios.post('http://localhost:3000/favoritos', {
        id_usuario,
        id_departamento_activo: id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Añadido a favoritos correctamente');
      setEsFavorito(true);
      alert('Añadido a favoritos correctamente');
    } catch (err) {
      console.error('Error al añadir a favoritos:', err);
      setError(err.response?.data?.error || 'Error al añadir a favoritos');
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!departamento) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <br></br><br></br>
      {usuario && usuario.tipo === 'estudiante' && <NavBarEstudiante />}
      {usuario && usuario.tipo === 'administrador' && <NavBarAdministrador />}
      {usuario && usuario.tipo === 'arrendador' && <NavBarArrendador />}
      <DetallesContainer>
        <ImageContainer>
          <img
            src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl}
            alt={departamento.nombre}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImageUrl;
            }}
          />
          {usuario && usuario.tipo === 'estudiante' && (
            <>
              <button className="solicitar-visita-button" onClick={openModal}>Solicitar Visita</button>
              <button
                className={`anadir-a-favorito ${esFavorito ? 'disabled' : ''}`}
                onClick={handleAnadirAFavorito}
                disabled={esFavorito}
              >
                {esFavorito ? 'En Favoritos' : 'Añadir a Favorito'}
              </button>
              <button className="ver-comentarios-button" onClick={openComentariosModal}>Ver Comentarios del Arrendador</button>
            </>
          )}
        </ImageContainer>
        <DetallesContent>
          <h1>{departamento.nombre}</h1>
          <p><strong>Departamento Activo:</strong> {id}</p>
          <p><strong>Dirección:</strong> {departamento.direccion}</p>
          <p><strong>Precio:</strong> {departamento.precio}</p>
          <p><strong>Descripción:</strong> {departamento.descripcion}</p>
          <p><strong>Número de Baños:</strong> {departamento.n_banos}</p>
          <p><strong>Número de Habitaciones:</strong> {departamento.n_habitaciones}</p>
          <p><strong>Tamaño en Metros Cuadrados:</strong> {departamento.tamano_m_cuadrados}</p>
          <p><strong>Acepta Gatos:</strong> {departamento.aceptan_gatos ? 'Sí' : 'No'}</p>
          <p><strong>Acepta Perros:</strong> {departamento.aceptan_perros ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Luz:</strong> {departamento.incluye_luz ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Agua:</strong> {departamento.incluye_agua ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Teléfono:</strong> {departamento.incluye_telefono ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Internet:</strong> {departamento.incluye_internet ? 'Sí' : 'No'}</p>
          <p><strong>Incluye Garaje:</strong> {departamento.incluye_garaje ? 'Sí' : 'No'}</p>
          <p><strong>Lavandería:</strong> {departamento.lavanderia ? 'Sí' : 'No'}</p>
        </DetallesContent>
      </DetallesContainer>
      {mensaje && <Mensaje>{mensaje}</Mensaje>}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={ModalStyles}
        contentLabel="Solicitud de Visita"
      >
        <SolicitudVisitaForm>
          <h2>Solicitud de Visita</h2>
          <label>
            Fecha Solicitada:
            <input
              type="date"
              value={fechaSolicitada}
              onChange={(e) => setFechaSolicitada(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            />
          </label>
          <label>
            Comentario:
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </label>
          <button onClick={handleSolicitudVisita}>Enviar Solicitud de Visita</button>
          <button onClick={closeModal} style={{ backgroundColor: '#dc3545', marginTop: '10px' }}>Cancelar</button>
        </SolicitudVisitaForm>
      </Modal>

      <Modal
        isOpen={comentariosModalIsOpen}
        onRequestClose={closeComentariosModal}
        style={ModalStyles}
        contentLabel="Comentarios del Arrendador"
      >
        <ModalHeader>
          <button onClick={closeComentariosModal} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '10px', cursor: 'pointer' }}>Cerrar</button>
          <h2>Comentarios del Arrendador</h2>
        </ModalHeader>
        <TabsContainer>
          <Tab active={activeTab === 'aau'} onClick={() => setActiveTab('aau')}>Comentarios Emitidos</Tab>
          <Tab active={activeTab === 'uaa'} onClick={() => setActiveTab('uaa')}>Comentarios Recibidos</Tab>
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

export default DepartamentoDetalles;
