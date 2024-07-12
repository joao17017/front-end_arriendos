import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import { jwtDecode } from 'jwt-decode';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  img {
    width: 100%;
    max-width: 600px;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  button {
    width: 100%;
    max-width: 600px;
    margin-top: 10px;
    padding: 10px 20px;
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

const Content = styled.div`
  flex: 2;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  strong {
    display: inline-block;
    width: 150px;
    color: #333;
  }
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

const DepartamentoDetalles2 = () => {
  const { id } = useParams();
  const [departamento, setDepartamento] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [fechaSolicitada, setFechaSolicitada] = useState('');
  const [comentario, setComentario] = useState('');

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
        id_departamento: id
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
      {usuario && usuario.tipo === 'estudiante' && <NavBarEstudiante />}
      {usuario && usuario.tipo === 'administrador' && <NavBarAdministrador />}
      {usuario && usuario.tipo === 'arrendador' && <NavBarArrendador />}
      <Container>
        <DetailsContainer>
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
                <button onClick={handleSolicitudVisita}>Solicitar Visita</button>
                <button onClick={handleAnadirAFavorito}>Añadir a Favorito</button>
              </>
            )}
          </ImageContainer>
          <Content>
            <h1>{departamento.nombre}</h1>
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
          </Content>
        </DetailsContainer>
        {usuario && usuario.tipo === 'estudiante' && (
          <Form>
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
          </Form>
        )}
        {mensaje && <Mensaje>{mensaje}</Mensaje>}
      </Container>
    </div>
  );
};

export default DepartamentoDetalles2;
