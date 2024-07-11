  // src/components/CrearDepartamento.js
  import React, { useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { jwtDecode } from 'jwt-decode';
  import NavBarArrendador from './NavBarArrendador';
  import './CrearDepartamento.css';

  const CrearDepartamento = () => {
    const [departamento, setDepartamento] = useState({
      nombre: '',
      direccion: '',
      precio: '',
      descripcion: '',
      incluye_luz: false,
      todos_los_servicios_basicos: false,
      incluye_agua: false,
      incluye_telefono: false,
      incluye_internet: false,
      incluye_garaje: false,
      n_banos: '',
      n_habitaciones: '',
      tamano_m_cuadrados: '',
      aceptan_gatos: false,
      aceptan_perros: false,
      lavanderia: false,
      imagen: null
    });
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setDepartamento((prevDepartamento) => ({
        ...prevDepartamento,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    const handleImageChange = (e) => {
      setNuevaImagen(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        for (const key in departamento) {
          formData.append(key, departamento[key]);
        }
        if (nuevaImagen) {
          formData.append('imagen', nuevaImagen);
        }

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        formData.append('id_arrendador', decoded.id);

        await axios.post('http://localhost:3000/departamentos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        navigate('/arrendador/mis-departamentos');
      } catch (err) {
        console.error('Error creating departamento:', err);
      }
    };

    return (
      <div>
        <NavBarArrendador />
        <div className="edit-container mt-5">
          <h1>Crear Nuevo Departamento</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Parte Izquierda */}
              <div className="form-left">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={departamento.nombre}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={departamento.direccion}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={departamento.precio}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={departamento.descripcion}
                    onChange={handleChange}
                    className="form-control descripcion-textarea"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Número de Baños</label>
                      <input
                        type="number"
                        name="n_banos"
                        value={departamento.n_banos}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Número de Habitaciones</label>
                      <input
                        type="number"
                        name="n_habitaciones"
                        value={departamento.n_habitaciones}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Parte Derecha */}
              <div className="form-right">
                <div className="form-group">
                  <label className="form-label">Servicios Básicos</label>
                  <div className="form-check-group">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="incluye_luz"
                        checked={departamento.incluye_luz}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Luz</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="todos_los_servicios_basicos"
                        checked={departamento.todos_los_servicios_basicos}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Servicios Básicos</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="incluye_agua"
                        checked={departamento.incluye_agua}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Agua</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="incluye_telefono"
                        checked={departamento.incluye_telefono}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Teléfono</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="incluye_internet"
                        checked={departamento.incluye_internet}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Internet</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="incluye_garaje"
                        checked={departamento.incluye_garaje}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Garaje</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="lavanderia"
                        checked={departamento.lavanderia}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Lavandería</label>
                    </div>
                  </div>
                </div>
        
                <div className="form-group">
                  <label className="form-label">Mascotas</label>
                  <div className="form-check-group">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="aceptan_gatos"
                        checked={departamento.aceptan_gatos}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Gatos</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="aceptan_perros"
                        checked={departamento.aceptan_perros}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Perros</label>
                    </div>
                  </div>
                </div>
        
                <div className="form-bottom-row">
                  <div className="form-group">
                    <label className="form-label">Tamaño (m²)</label>
                    <input
                      type="number"
                      name="tamano_m_cuadrados"
                      value={departamento.tamano_m_cuadrados}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
        
                  <div className="form-group">
                    <label className="form-label">Imagen</label>
                    <input
                      type="file"
                      name="imagen"
                      onChange={handleImageChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
        
            <button type="submit" className="btn btn-primary submit-button">
              Crear Departamento
            </button>
          </form>
        </div>
      </div>
    );
    
  };
  
  
  export default CrearDepartamento;
