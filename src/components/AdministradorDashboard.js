import React, { useState, useEffect } from 'react';
import NavBarAdministrador from './NavBarAdministrador';
import './AdministradorDashboard.css';

const AdministradorDashboard = () => {
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeUserType, setActiveUserType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleUserManagementClick = () => {
    setShowUserManagement(!showUserManagement);
  };

  const handleSelectUserType = (type) => {
    setActiveUserType(type);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handleSearchSubmit = async () => {
      if (activeUserType && searchQuery) {
        try {
          let url = '';
          if (activeUserType === 'Arrendador') {
            url = `http://localhost:3000/arrendadores/buscar/${searchQuery}`;
          } else if (activeUserType === 'Administrador') {
            url = `http://localhost:3000/administradores/buscar/${searchQuery}`;
          } else if (activeUserType === 'Estudiante') {
            url = `http://localhost:3000/estudiantes/buscar/${searchQuery}`;
          }

          const response = await fetch(url);
          const data = await response.json();

          if (response.ok) {
            setSearchResults(data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error al realizar la búsqueda:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    handleSearchSubmit();
  }, [searchQuery, activeUserType]);

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
                  <input
                    type="text"
                    placeholder={`Buscar ${activeUserType} por nombre o ID`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="search-results">
                    {searchResults.length > 0 && (
                      <ul>
                        {searchResults.map((result) => (
                          <li key={result.id_administrador || result.id_arrendador || result.id_estudiante}>
                            {result.nombres} - {result.cedula} - {result.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
