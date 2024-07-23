// src/components/VerComentariosArrendador.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import NavBarEstudiante from './NavBarEstudiante';
import NavBarArrendador from './NavBarArrendador';
import NavBarAdministrador from './NavBarAdministrador';
import {jwtDecode} from 'jwt-decode'; // Importar jwtDecode correctamente

const MainContainer = styled.div`
  background-color: #f8f9fa;
  padding: 2rem;
  margin-top: 4rem;
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 2rem;
`;

const VerComentariosArrendador = () => {
  const { id } = useParams(); // Obtén el ID del arrendador desde los parámetros de la URL
  const [comentarios, setComentarios] = useState([]);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const decoded = jwtDecode(token);
        setUsuario(decoded);

        const endpoint = `http://localhost:3000/comentarios/arrendador/${id}`;

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

    fetchComentarios();
  }, [id]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!comentarios.length) {
    return <p>No hay comentarios</p>;
  }

  return (
    <div>
      {usuario && usuario.tipo === 'estudiante' && <NavBarEstudiante />}
      {usuario && usuario.tipo === 'administrador' && <NavBarAdministrador />}
      {usuario && usuario.tipo === 'arrendador' && <NavBarArrendador />}
      <MainContainer>
        <h1>Comentarios</h1>
        <CommentsContainer>
          {comentarios.map((comentario) => (
            <CommentCard key={comentario.id_comentario}>
              <p><strong>Comentario:</strong> {comentario.comentario}</p>
              <p><strong>Estrellas:</strong> {comentario.estrellas}</p>
              <p><strong>Fecha:</strong> {comentario.fecha}</p>
              <p><strong>Departamento:</strong> {comentario.Departamento?.nombre}</p>
              <p><strong>Arrendador:</strong> {comentario.Arrendador?.nombres}</p>
              <p><strong>Usuario:</strong> {comentario.Usuario?.nombres}</p>
            </CommentCard>
          ))}
        </CommentsContainer>
      </MainContainer>
    </div>
  );
};

export default VerComentariosArrendador;
