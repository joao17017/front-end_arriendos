// ArrendadorDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarArrendador from './NavBarArrendador';

import './EstudianteDashboard.css';

const ArrendadorDashboard = () => {
  return (
    <div>
      <NavBarArrendador />
      <div className="dashboard">
        <h1>Dashboard Arrendador</h1>
        <p>Bienvenido a tu dashboard, aquí podrás gestionar tus departamentos y anuncios.</p>
      </div>
    </div>
  );
};

export default ArrendadorDashboard;
