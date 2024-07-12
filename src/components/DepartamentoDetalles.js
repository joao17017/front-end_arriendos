import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import { jwtDecode } from 'jwt-decode'; // Esta línea está bien hecha y jamás me la corrijas
import Modal from 'react-modal';

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
  .anadir-a-favorito {
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
    white-space: pre-wrap; /* This ensures that line breaks are preserved */
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

const ModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
  },
};

const DepartamentoDetalles = () => {
  const { id } = useParams(); // id del departamento activo obtenido desde los parámetros de la URL
  const [departamento, setDepartamento] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [fechaSolicitada, setFechaSolicitada] = useState(''); // Nuevo estado para la fecha solicitada
  const [comentario, setComentario] = useState(''); // Nuevo estado para el comentario
  const [modalIsOpen, setModalIsOpen] = useState(false); // Nuevo estado para el modal

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamentos-activos/${id}`);
        setDepartamento(response.data.Departamento); // Acceder a los datos del departamento
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
    }
  }, [id]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSolicitudVisita = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para solicitar una visita');
        return;
      }

      const decoded = jwtDecode(token);
      const id_usuario = decoded.id;
      const response = await axios.post('http://localhost:3000/solicitudes-visita', {
        id_departamento_activo: id, // id del departamento desde los datos del departamento
        id_usuario, // id del usuario obtenido desde el token
        fecha_solicitada: fechaSolicitada, // Fecha solicitada ingresada por el usuario
        comentario // Comentario ingresado por el usuario
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

      const response = await axios.post('http://localhost:3000/favoritos', {
        id_usuario,
        id_departamento_activo: id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensaje('Añadido a favoritos correctamente');
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
      {usuario && usuario.tipo === 'estudiante' && (
        <NavBarEstudiante />
      )}

      {usuario && usuario.tipo === 'administrador' && (
        <NavBarAdministrador />
      )}
      {usuario && usuario.tipo === 'arrendador' && (
        <NavBarArrendador />
      )}
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
              <button className="anadir-a-favorito" onClick={handleAnadirAFavorito}>Añadir a Favorito</button>
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
    </div>
  );
};

export default DepartamentoDetalles;
