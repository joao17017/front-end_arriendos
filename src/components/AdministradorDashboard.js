import React, { useState, useEffect } from 'react';
import NavBarAdministrador from './NavBarAdministrador';
import './AdministradorDashboard.css';

const AdministradorDashboard = () => {
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeUserType, setActiveUserType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState({
    id: '',
    cedula: '',
    nombres: '',
    telefono: '',
    email: '',
    contrasena: ''
  });

  const handleUserManagementClick = () => {
    setShowUserManagement(!showUserManagement);
  };

  const handleSelectUserType = (type) => {
    setActiveUserType(type);
    setSearchQuery('');
    setSearchResults([]);
    setNoResultsMessage(false);
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
            setNoResultsMessage(data.length === 0);
          } else {
            setSearchResults([]);
            setNoResultsMessage(true);
          }
        } catch (error) {
          console.error('Error al realizar la búsqueda:', error);
          setSearchResults([]);
          setNoResultsMessage(true);
        }
      } else {
        setSearchResults([]);
        setNoResultsMessage(false);
      }
    };

    handleSearchSubmit();
  }, [searchQuery, activeUserType]);

  const handleEdit = (data) => {
    setEditData(data);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        let url = '';
        if (activeUserType === 'Arrendador') {
          url = `http://localhost:3000/arrendadores/${deleteId}`;
        } else if (activeUserType === 'Administrador') {
          url = `http://localhost:3000/administradores/${deleteId}`;
        } else if (activeUserType === 'Estudiante') {
          url = `http://localhost:3000/estudiantes/${deleteId}`;
        }

        const response = await fetch(url, {
          method: 'DELETE'
        });

        if (response.ok) {
          setSearchResults(searchResults.filter(result => (result.id_administrador || result.id_arrendador || result.id_estudiante) !== deleteId));
          setShowDeleteModal(false);
          setDeleteId(null);
        } else {
          alert('Error al eliminar el registro');
        }
      } catch (error) {
        console.error('Error al eliminar el registro:', error);
        alert('Error al eliminar el registro');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      let url = '';
      if (activeUserType === 'Arrendador') {
        url = `http://localhost:3000/arrendadores/${editData.id}`;
      } else if (activeUserType === 'Administrador') {
        url = `http://localhost:3000/administradores/${editData.id}`;
      } else if (activeUserType === 'Estudiante') {
        url = `http://localhost:3000/estudiantes/${editData.id}`;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setSearchResults((prevResults) => prevResults.map((result) =>
          result.id === updatedRecord.id ? updatedRecord : result
        ));
        setShowEditModal(false);
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios');
    }
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
                  <input
                    type="text"
                    placeholder={`Buscar ${activeUserType} por nombre o ID`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="search-results-container">
                    {searchQuery && (
                      <div className="search-results-box">
                        {searchResults.length > 0 ? (
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Cédula</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {searchResults.map((result, index) => (
                                <tr key={result.id_administrador || result.id_arrendador || result.id_estudiante}>
                                  <td>{index + 1}</td>
                                  <td>{result.nombres}</td>
                                  <td>{result.cedula}</td>
                                  <td>{result.telefono}</td>
                                  <td>{result.email}</td>
                                  <td>
                                    <button onClick={() => handleEdit(result)}>
                                      Editar
                                    </button>
                                    <button onClick={() => handleDelete(result.id_administrador || result.id_arrendador || result.id_estudiante)}>
                                      Eliminar
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          noResultsMessage && <p>No se encontraron resultados</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>¿Está seguro de que desea eliminar este registro?</h3>
            <button onClick={confirmDelete}>Confirmar</button>
            <button onClick={cancelDelete}>Cancelar</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <form>
              <div>
                <label>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={editData.cedula}
                  onChange={handleEditChange}
                  disabled
                />
              </div>
              <div>
                <label>Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={editData.nombres}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={editData.telefono}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  value={editData.contrasena}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <button type="button" onClick={saveEdit}>Guardar</button>
                <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministradorDashboard;
