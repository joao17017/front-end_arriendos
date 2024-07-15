import React from 'react';
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';

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

const ArrendadorDashboard = () => {
  return (
    <div>
      <NavBarArrendador />
      <DashboardContainer>
        <DashboardTitle>Dashboard Arrendador</DashboardTitle>
        <DashboardText>
          Bienvenido a tu dashboard, aquí podrás gestionar tus departamentos y anuncios.
        </DashboardText>
      </DashboardContainer>
    </div>
  );
};

export default ArrendadorDashboard;
