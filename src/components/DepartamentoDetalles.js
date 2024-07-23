// DepartamentoDetalles.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import { jwtDecode } from 'jwt-decode'; // Esta línea está bien hecha y jamás me la corrijas
import Modal from 'react-modal';
import Rating from 'react-rating-stars-component';

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem; /* Menos padding en pantallas pequeñas */
  }
`;

const CelesteContainer = styled.div`
  background-color: #F3F6FF;
  padding: 5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem; /* Menos padding en pantallas pequeñas */
  }
`;

const DetallesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .button-container {
    display: flex;
    gap: 1rem; /* Espacio entre los botones */
    margin-top: 1rem;

    @media (max-width: 768px) {
      flex-direction: column; /* Apilar botones en pantallas pequeñas */
      gap: 0.5rem; /* Espacio reducido entre botones */
    }
  }

  .solicitar-visita-button,
  .anadir-a-favorito {
    background-color: #D8A143;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    flex: 1;

    &:hover {
      background-color: #252531;
    }

    &.anadir-a-favorito.disabled {
      background-color: #252531;
      cursor: not-allowed;
    }
  }
`;

const DetallesContent = styled.div`
  flex: 2;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  text-align: left; /* Asegura que el texto esté alineado a la izquierda */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem; /* Menos padding en pantallas pequeñas */
    gap: 1rem; /* Espacio reducido entre elementos en pantallas pequeñas */
  }

  h1 {
    grid-column: span 2;
    margin-bottom: 2rem;
    color: #252531;
    text-align: center; /* Centra el título */
  }

  p {
    color: #252531;

    strong {
      color: #DFB163;
    }
  }
`;

const SolicitudVisitaForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  label {
    margin-bottom: 0.5rem;
    color: #252531;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    outline: none;

    &:focus {
      border-color: #D8A143;
    }
  }

  button {
    background-color: #252531;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #D8A143;
    }

    &.btn-secondary {
      background-color: #252531;
      margin-top: 10px;

      &:hover {
        background-color: #D8A143;
      }
    }
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
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
  const [esFavorito, setEsFavorito] = useState(false); // Nuevo estado para el favorito

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

      // Verificar si el departamento está en los favoritos del usuario
      const verificarFavorito = async () => {
        try {
          const response = await axios.post('http://localhost:3000/favoritos/verificar', {
            id_usuario: decoded.id,
            id_departamento_activo: id
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

  const handleSolicitudVisita = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para solicitar una visita');
        return;
      }

      // Validar fecha solicitada
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
      setEsFavorito(true);
      alert('Añadido a favoritos correctamente');
    } catch (err) {
      console.error('Error al añadir a favoritos:', err);
      setError(err.response?.data?.error || 'Error al añadir a favoritos');
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!departamento) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <br></br><br></br>
      {usuario && usuario.tipo === 'estudiante' && <NavBarEstudiante />}
      {usuario && usuario.tipo === 'arrendador' && <NavBarArrendador />}
      {usuario && usuario.tipo === 'administrador' && <NavBarAdministrador />}
      <MainContainer>
        <CelesteContainer>
          <DetallesContainer>
            <ImageContainer>
              <img src={departamento.foto ? `http://localhost:3000/uploads/${departamento.foto}` : defaultImageUrl} alt="Departamento" />
              {usuario && usuario.tipo === 'estudiante' && (
                <div className="button-container">
                  <button className="solicitar-visita-button" onClick={openModal}>Solicitar Visita</button>
                  <button
                    className={`anadir-a-favorito ${esFavorito ? 'disabled' : ''}`}
                    onClick={esFavorito ? null : handleAnadirAFavorito}
                    disabled={esFavorito}
                  >
                    {esFavorito ? 'Añadido a favoritos' : 'Añadir a favoritos'}
                  </button>
                </div>
              )}
            </ImageContainer>
            <DetallesContent>
              <h1>{departamento.nombre}</h1>
              <div>
                <p><strong>Departamento Activo:</strong> {id}</p>
                <p><strong>Dirección:</strong> {departamento.direccion}</p>
                <p><strong>Precio:</strong> {departamento.precio}</p>
                <p><strong>Descripción:</strong> {departamento.descripcion}</p>
                <p><strong>Número de Baños:</strong> {departamento.n_banos}</p>
                <p><strong>Número de Habitaciones:</strong> {departamento.n_habitaciones}</p>
                <p><strong>Tamaño en Metros Cuadrados:</strong> {departamento.tamano_m_cuadrados}</p>
              </div>
              <div>
                <p><strong>Acepta Gatos:</strong> {departamento.aceptan_gatos ? 'Sí' : 'No'}</p>
                <p><strong>Acepta Perros:</strong> {departamento.aceptan_perros ? 'Sí' : 'No'}</p>
                <p><strong>Incluye Luz:</strong> {departamento.incluye_luz ? 'Sí' : 'No'}</p>
                <p><strong>Incluye Agua:</strong> {departamento.incluye_agua ? 'Sí' : 'No'}</p>
                <p><strong>Incluye Teléfono:</strong> {departamento.incluye_telefono ? 'Sí' : 'No'}</p>
                <p><strong>Incluye Internet:</strong> {departamento.incluye_internet ? 'Sí' : 'No'}</p>
                <p><strong>Incluye Garaje:</strong> {departamento.incluye_garaje ? 'Sí' : 'No'}</p>
                <p><strong>Lavandería:</strong> {departamento.lavanderia ? 'Sí' : 'No'}</p>
              </div>
            </DetallesContent>
          </DetallesContainer>
        </CelesteContainer>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={ModalStyles}
          contentLabel="Solicitud de visita"
        >
          <h2>Solicitar Visita</h2>
          <SolicitudVisitaForm>
            <label htmlFor="fecha-solicitada">Fecha solicitada:</label>
            <input
              type="date"
              id="fecha-solicitada"
              value={fechaSolicitada}
              onChange={(e) => setFechaSolicitada(e.target.value)}
            />
            <label htmlFor="comentario">Comentario:</label>
            <textarea
              id="comentario"
              rows="4"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <button onClick={handleSolicitudVisita}>Enviar Solicitud</button>
            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
          </SolicitudVisitaForm>
        </Modal>
      </MainContainer>
    </div>
  );
};

export default DepartamentoDetalles;
