import React, { useState } from 'react';
import NavBarAdministrador from './NavBarAdministrador';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';

const DashboardContainer = styled.div`
  margin-top: 70px; /* Ajusta este valor según la altura de tu navbar */
  padding: 20px;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  h1 {
    font-size: 2.5rem;
    color: #343a40;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    text-align: center;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  .input-group {
    display: flex;
    align-items: center;
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      &:disabled {
        background-color: #e9ecef;
      }
    }
    .edit-button {
      margin-left: 10px;
      background: none;
      border: none;
      cursor: pointer;
      color: #007bff;
      &:hover {
        color: #0056b3;
      }
    }
  }
`;

const AdministradorDashboard = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id_administrador: '',
    cedula: '',
    nombres: '',
    telefono: '',
    email: '',
    contrasena: ''
  });
  const [editableFields, setEditableFields] = useState({
    nombres: false,
    telefono: false,
    email: false,
    contrasena: false
  });

  const handleEdit = (data) => {
    setEditData({
      ...data,
      contrasena: ''
    });
    setEditableFields({
      nombres: false,
      telefono: false,
      email: false,
      contrasena: false
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleEditableField = (field) => {
    setEditableFields((prevEditableFields) => ({
      ...prevEditableFields,
      [field]: !prevEditableFields[field]
    }));
  };

  const saveEdit = async () => {
    // Aquí puedes implementar la lógica para guardar los cambios si es necesario
    setShowEditModal(false);
  };

  return (
    <DashboardContainer>
      <NavBarAdministrador />
      <WelcomeMessage>
        <h1>Bienvenido al Dashboard Administrador</h1>
      </WelcomeMessage>
      {/* Aquí no hay búsqueda ni botones para seleccionar usuarios */}
      {showEditModal && (
        <Modal>
          <div className="modal-content">
            <h2>Editar Administrador</h2>
            <FormGroup>
              <div className="input-group">
                <input
                  type="text"
                  name="nombres"
                  value={editData.nombres}
                  onChange={handleEditChange}
                  disabled={!editableFields.nombres}
                />
                <button className="edit-button" onClick={() => toggleEditableField('nombres')}>
                  {editableFields.nombres ? 'Guardar' : 'Editar'}
                </button>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="input-group">
                <input
                  type="text"
                  name="telefono"
                  value={editData.telefono}
                  onChange={handleEditChange}
                  disabled={!editableFields.telefono}
                />
                <button className="edit-button" onClick={() => toggleEditableField('telefono')}>
                  {editableFields.telefono ? 'Guardar' : 'Editar'}
                </button>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  disabled={!editableFields.email}
                />
                <button className="edit-button" onClick={() => toggleEditableField('email')}>
                  {editableFields.email ? 'Guardar' : 'Editar'}
                </button>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="input-group">
                <input
                  type="password"
                  name="contrasena"
                  value={editData.contrasena}
                  onChange={handleEditChange}
                  disabled={!editableFields.contrasena}
                />
                <button className="edit-button" onClick={() => toggleEditableField('contrasena')}>
                  {editableFields.contrasena ? 'Guardar' : 'Editar'}
                </button>
              </div>
            </FormGroup>
            <button onClick={saveEdit}>Guardar Cambios</button>
            <button onClick={() => setShowEditModal(false)}>Cerrar</button>
          </div>
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default AdministradorDashboard;
