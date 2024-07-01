// src/components/AnunciosActivados.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBarArrendador from './NavBarArrendador';

const AnunciosActivados = () => {
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/anuncios-activados');
        setAnuncios(response.data);
      } catch (err) {
        console.error('Error fetching anuncios activados:', err);
      }
    };

    fetchAnuncios();
  }, []);

  return (
    <div>
      <NavBarArrendador />
      <h1>Anuncios Activados</h1>
      <div>
        {anuncios.map(anuncio => (
          <div key={anuncio.id}>
            <h2>{anuncio.titulo}</h2>
            <p>{anuncio.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnunciosActivados;
