import React, { useEffect, useState } from 'react';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';
import Slider from 'react-slick';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Styled component for the dashboard container
const DashboardContainer = styled.div`
  margin-top: 56px; // Ajusta este valor según la altura de tu barra de navegación
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 56px); // Ajusta para incluir la altura de la barra de navegación
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  color: #343a40;
`;

const DashboardText = styled.p`
  font-size: 1.125rem;
  color: #6c757d;
`;

// Styled component for the carousel container
const CarouselContainer = styled.div`
  margin-top: 20px;
  max-width: 600px; /* Ajusta el ancho máximo del contenedor del carrusel si es necesario */
  margin: 0 auto; /* Centra el carrusel */
`;

// Styled component for the image
const CarouselImage = styled.img`
  width: 100%;
  height: 300px; /* Ajusta la altura según sea necesario */
  object-fit: cover; /* Ajusta la forma en que la imagen se ajusta al contenedor */
  border: 5px solid #252531; /* Agrega el borde de color */
`;

// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const ArrendadorDashboard = () => {
  const [departamentos, setDepartamentos] = useState([]);
  
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;
        const response = await axios.get(`http://localhost:3000/departamentos/arrendador/${id_arrendador}`);
        setDepartamentos(response.data);
      } catch (err) {
        console.error("Error fetching departamentos:", err);
      }
    };
    fetchDepartamentos();
  }, []);

  return (
    <div>
      <NavBarArrendador />
      <DashboardContainer>
        <DashboardTitle>Dashboard Arrendador</DashboardTitle>
        <DashboardText>
          Bienvenido a tu dashboard, aquí podrás gestionar tus departamentos y anuncios.
        </DashboardText>
        <CarouselContainer>
          <Slider {...sliderSettings}>
            {departamentos.map((departamento) => (
              <div key={departamento.id_departamento}>
                <CarouselImage
                  src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : 'http://localhost:3000/uploads/defaultimagedepartamento.png'}
                  alt={departamento.nombre}
                  onError={(e) => {
                    e.target.src = 'http://localhost:3000/uploads/defaultimagedepartamento.png'; // Fallback image on error
                  }}
                />
              </div>
            ))}
          </Slider>
        </CarouselContainer>
      </DashboardContainer>
    </div>
  );
};

export default ArrendadorDashboard;
