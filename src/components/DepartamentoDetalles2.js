import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import { jwtDecode } from 'jwt-decode';
import { FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';
import Modal from 'react-modal';

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 2rem;
  margin-top: 4rem;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column; /* Cambiado a columna por defecto */
  padding: 5rem 2rem;
  background-color: #F3F6FF;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row; /* Cambia a fila en pantallas más grandes */
  }
`;

const TextSection = styled.div`
  flex: 1;
  padding-right: 2rem;

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

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const Mensaje = styled.p`
  color: green;
  text-align: center;
`;

const Form = styled.div`
  margin-top: 20px;

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 2px solid #DFB163; /* Borde dorado para los inputs */
    border-radius: 4px;
  }

  button {
    width: 48%;
    padding: 10px;
    background-color: #252531; /* Fondo negro para los botones */
    color: #fff; /* Letras blancas para los botones */
    border: 2px solid #DFB163; /* Borde dorado para los botones */
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-right: 4%;
    
    &:hover {
      background-color: #333; /* Fondo negro más oscuro para el hover */
    }
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }

  .btn-close {
    width: 48%;
    background-color: #252531; /* Fondo rojo para el botón de cerrar */
    border: 2px solid #DFB163; /* Borde dorado para el botón de cerrar */
    margin-right: 0;
  }
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #252531', /* Borde negro para el modal */
    borderRadius: '8px',
    padding: '2rem',
  },
};

const DepartamentoDetalles2 = () => {
  const { id } = useParams();
  const [departamento, setDepartamento] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [fechaSolicitada, setFechaSolicitada] = useState('');
  const [comentario, setComentario] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamentos/${id}`);
        setDepartamento(response.data);
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

  const handleSolicitudVisita = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor inicia sesión para solicitar una visita');
        return;
      }

      const decoded = jwtDecode(token);
      const id_usuario = decoded.id;

      await axios.post('http://localhost:3000/solicitudes-visita', {
        id_departamento: id,
        id_usuario,
        fecha_solicitada: fechaSolicitada,
        comentario
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensaje('Solicitud de visita enviada correctamente');
      alert('Solicitud de visita enviada correctamente');
      closeModal();
    } catch (err) {
      console.error('Error al enviar la solicitud de visita:', err);
      setError(err.response?.data?.error || 'Error al enviar la solicitud de visita');
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!departamento) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      {usuario && usuario.tipo === 'estudiante' && <NavBarEstudiante />}
      {usuario && usuario.tipo === 'administrador' && <NavBarAdministrador />}
      {usuario && usuario.tipo === 'arrendador' && <NavBarArrendador />}
      <MainContainer>
        <SectionContainer>
          <TextSection>
            <h6>Departamento</h6>
            <h1>{departamento.nombre}</h1>
            <p>{departamento.descripcion}</p>
            <ul>
              <li>
                <h5><FaAddressCard style={{ color: '#DFB163' }} /> <span>Dirección:</span> {departamento.direccion}</h5>
              </li>
              <li>
                <h5><FaHandHoldingUsd style={{ color: '#DFB163' }} /> <span>Precio:</span> {departamento.precio}</h5>
              </li>
              <li>
                <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Número de Baños:</span> {departamento.n_banos}</h5>
              </li>
              <li>
                <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Número de Habitaciones:</span> {departamento.n_habitaciones}</h5>
              </li>
              <li>
                <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Acepta Perros:</span> {departamento.aceptan_perros ? 'Sí' : 'No'}</h5>
              </li>
              <li>
                <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Incluye Agua:</span> {departamento.incluye_agua ? 'Sí' : 'No'}</h5>
              </li>
              <li>
                <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Incluye Luz:</span> {departamento.incluye_luz ? 'Sí' : 'No'}</h5>
              </li>
              <li>
                <h5><FaUserTie style={{ color: '#DFB163' }} /> <span>Incluye Internet:</span> {departamento.incluye_internet ? 'Sí' : 'No'}</h5>
              </li>
            </ul>
          </TextSection>
          <ImageSection>
            <img src={departamento.imageUrl || defaultImageUrl} alt="Departamento" />
          </ImageSection>
        </SectionContainer>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Formulario de Solicitud de Visita"
        >
          <h2>Solicitud de Visita</h2>
          <Form>
            <label htmlFor="fechaSolicitada">Fecha Solicitada:</label>
            <input 
              type="date" 
              id="fechaSolicitada" 
              value={fechaSolicitada} 
              onChange={(e) => setFechaSolicitada(e.target.value)} 
            />
            <label htmlFor="comentario">Comentario:</label>
            <textarea 
              id="comentario" 
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} 
            />
            <div className="button-group">
              <button onClick={handleSolicitudVisita}>Enviar Solicitud</button>
              <button onClick={closeModal} className="btn-close">Cerrar</button>
            </div>
          </Form>
          {mensaje && <Mensaje>{mensaje}</Mensaje>}
        </Modal>
      </MainContainer>
    </div>
  );
};

export default DepartamentoDetalles2;
