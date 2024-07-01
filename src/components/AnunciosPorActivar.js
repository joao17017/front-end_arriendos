// src/components/AnunciosPorActivar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';
import './EstudianteDashboard.css';

const AnunciosPorActivar = () => {
  return (
    <div>
      <NavBarArrendador />
      <div className="dashboard">
        <h1>Anuncios por Activar de Arrendador</h1>
        <p>Bienvenido a tu listado de departamentos por activarse.</p>
      </div>
    </div>
  );
};

export default AnunciosPorActivar;
