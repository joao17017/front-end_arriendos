// src/components/DepartamentosArrendados.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Importa jwtDecode correctamente
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';
import { FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';
import Modal from 'react-modal';
import Rating from 'react-rating-stars-component';

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 2rem;
  margin-top: 4rem;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5rem 2rem;
  background-color: #F3F6FF;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TextSection = styled.div`
  flex: 1;
  margin-bottom: 2rem;

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

  .btn {
    background-color: #007bff;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background-color: #0056b3;
    }

    &.btn-danger {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }
    }

    &.btn-warning {
      background-color: #ffc107;

      &:hover {
        background-color: #e0a800;
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

const ButtonSection = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 10px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: #252531;
    margin-bottom: 1.5rem;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    div {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    label {
      margin-bottom: 0.5rem;
      color: #252531;
    }

    textarea, input {
      width: 95%;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ced4da;
      outline: none;

      &:focus {
        border-color: #007bff;
      }
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 10px;

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &.btn-primary {
          background-color: #007bff;
          color: white;

          &:hover {
            background-color: #0056b3;
          }
        }

        &.btn-secondary {
          background-color: #6c757d;
          color: white;

          &:hover {
            background-color: #5a6268;
          }
        }
      }
    }
  }
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-direction: row; /* Make sure stars are aligned horizontally */
`;

const DepartamentoCard = ({ departamento, onComentar, onEliminar, onDesocupar }) => {
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
        <ButtonSection>
          <button className="btn btn-primary" onClick={() => onComentar(departamento)}>Comentar</button>
          <button className="btn btn-danger" onClick={() => onEliminar(departamento.id_DepartamentoArrendado)}>Eliminar</button>
          <button className="btn btn-warning" onClick={() => onDesocupar(departamento.id_DepartamentoArrendado)}>Desocupar</button>
        </ButtonSection>
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
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(`http://localhost:3000/departamentos-arrendados/lista/${id_arrendador}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDepartamentos(response.data);
      } catch (err) {
        console.error('Error fetching departamentos arrendados:', err);
      }
    };

    fetchDepartamentos();
  }, [navigate]);

  const handleComentar = (departamento) => {
    setSelectedDepartamento(departamento);
    setModalIsOpen(true);
  };

  const submitComentario = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.post('http://localhost:3000/comentarios/arrendador-a-usuario', {
        id_usuario: selectedDepartamento.Usuario.id_usuario,
        id_arrendador: selectedDepartamento.Arrendador.id_arrendador,
        comentario,
        estrellas,
        id_departamento: selectedDepartamento.Departamento.id_departamento
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalIsOpen(false);
      setComentario('');
      setEstrellas(0);
      console.log('Comentario Enviado');
    } catch (err) {
      console.error('Error al comentar:', err);
    }
  };

  const handleEliminar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/departamentos-arrendados/${id_departamento_arrendado}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log('Departamento eliminado:', id_departamento_arrendado);
    } catch (err) {
      console.error('Error eliminando departamento arrendado:', err);
    }
  };

  const handleDesocupar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/departamentos-arrendados/desocupar/${id_departamento_arrendado}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log('Departamento desocupado:', id_departamento_arrendado);
    } catch (err) {
      console.error('Error desocupando departamento arrendado:', err);
    }
  };

  return (
    <div>
      <NavBarArrendador />
      <MainContainer>
        {departamentos.map((departamento) => (
          <DepartamentoCard
            key={departamento.id_departamento}
            departamento={departamento}
            onComentar={handleComentar}
            onEliminar={handleEliminar}
            onDesocupar={handleDesocupar}
          />
        ))}
      </MainContainer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
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
        }}
        contentLabel="Comentario"
      >
        <ModalContainer>
          <h2>Comentar a {selectedDepartamento?.Usuario?.nombres}</h2>
          <form onSubmit={(e) => { e.preventDefault(); submitComentario(); }}>
            <div>
              <label>Comentario:</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Estrellas:</label>
              <RatingContainer>
                <Rating
                  count={5}
                  size={24}
                  activeColor="#ffd700"
                  value={estrellas}
                  onChange={(newValue) => {
                    setEstrellas(newValue);
                  }}
                />
              </RatingContainer>
            </div>
            <div className="button-container">
              <button type="submit" className="btn btn-primary">Enviar</button>
              <button type="button" className="btn btn-secondary" onClick={() => setModalIsOpen(false)}>Cancelar</button>
            </div>
          </form>
        </ModalContainer>
      </Modal>
    </div>
  );
};

export default DepartamentosArrendados;
