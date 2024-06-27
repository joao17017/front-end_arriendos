import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import NavBar from './NavBar';
import { DataGrid } from '@mui/x-data-grid';

const ArrendatariosDataTable = () => {
  const [arrendatarios, setArrendatarios] = useState([]);
  const [error, setError] = useState('');

  // Obtener todos los arrendatarios
  const fetchArrendatarios = async () => {
    try {
      const response = await axios.get('/arrendatarios');
      setArrendatarios(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching arrendatarios');
    }
  };

  useEffect(() => {
    fetchArrendatarios();
  }, []);

  const columns = [
    { field: 'id_arrendatario', headerName: 'ID', width: 90 },
    { field: 'nombres', headerName: 'Nombres', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'telefono', headerName: 'Teléfono', width: 150 },
    { field: 'RUC', headerName: 'RUC', width: 150 },
    { field: 'direccion', headerName: 'Dirección', width: 200 },
    { field: 'Acciones', headerName: 'Acciones', width: 100}
  ];

  return (
    <div>
    <NavBar />
    <div style={{ height: 400, width: '100%' }}>
      <h1>Arrendatarios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DataGrid
        rows={arrendatarios}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id_arrendatario}
      />
    </div>
    </div>
  );
};

export default ArrendatariosDataTable;
