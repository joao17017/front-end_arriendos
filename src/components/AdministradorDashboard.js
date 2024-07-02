import React, { useState } from 'react';
import NavBarAdministrador from './NavBarAdministrador';
import './AdministradorDashboard.css';

const AdministradorDashboard = () => {
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeUserType, setActiveUserType] = useState('');

  const handleUserManagementClick = () => {
    setShowUserManagement(!showUserManagement);
  };

  const handleSelectUserType = (type) => {
    setActiveUserType(type);
  };

  return (
    <div>
      <NavBarAdministrador onGestionarUsuariosClick={handleUserManagementClick} />
      <div className="dashboard-container">
        {!showUserManagement ? (
          <div className="welcome-message">
            <h1>Bienvenido al Panel de Administrador</h1>
          </div>
        ) : (
          <div className="user-management-container">
            <div className="sidebar">
              <button onClick={() => handleSelectUserType('Estudiante')}>Estudiante</button>
              <button onClick={() => handleSelectUserType('Arrendador')}>Arrendador</button>
              <button onClick={() => handleSelectUserType('Administrador')}>Administrador</button>
            </div>
            <div className="main-content">
              {activeUserType && (
                <>
                  <h2>Gestionar Usuario: {activeUserType}</h2>
                  <input type="text" placeholder={`Buscar ${activeUserType} por nombre o ID`} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdministradorDashboard;
