// src/components/CrearDepartamento.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarArrendador from './NavBarArrendador';
import './EditarDepartamento.css';

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
     
      <div  className="edit-container col-lg-8 col-md-10 mb-5 mx-auto" style={{ backgroundColor: '#252531', padding: '20px', borderRadius: '10px', color: 'white' }}>
      <div class="col-lg-3 col-md-6 mb-5 col-lg-8 col-md-10 mx-auto">
      <h4 class="text-primary mb-4">Crear Departamento</h4>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
           
            <input type="text" class="form-control border-0" placeholder="Nombre" required="required" value={departamento.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            
            <input type="text" class="form-control border-0" placeholder="Direccion" required="required" value={departamento.direccion} onChange={handleChange} required />
          </div>
          <div className="form-group">
          
            <input type="number" class="form-control border-0" placeholder="Precio" required="required" value={departamento.precio} onChange={handleChange} required />
          </div>
          <div className="form-group">
           
            <textarea type="text" class="form-control border-0" placeholder="Descripcion" required="required" value={departamento.descripcion} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" class="form-control border-0" name="incluye_luz" checked={departamento.incluye_luz} onChange={handleChange} />
              Incluye Luz
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" class="form-control border-0" name="todos_los_servicios_basicos" checked={departamento.todos_los_servicios_basicos} onChange={handleChange} />
              Todos los Servicios Básicos
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox"  class="form-control border-0" name="incluye_agua" checked={departamento.incluye_agua} onChange={handleChange} />
              Incluye Agua
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" class="form-control border-0" name="incluye_telefono" checked={departamento.incluye_telefono} onChange={handleChange} />
              Incluye Teléfono
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox"  class="form-control border-0" name="incluye_internet" checked={departamento.incluye_internet} onChange={handleChange} />
              Incluye Internet
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox"  class="form-control border-0" name="incluye_garaje" checked={departamento.incluye_garaje} onChange={handleChange} />
              Incluye Garaje
            </label>
          </div>
          <div className="form-group">
            
            <input type="number" class="form-control border-0" placeholder="N° Baños" required="required" value={departamento.n_banos} onChange={handleChange} />
          </div>
          <div className="form-group">
           
            <input type="number" class="form-control border-0" placeholder="N° de Habitaciones" required="required" value={departamento.n_habitaciones} onChange={handleChange} />
          </div>
          <div className="form-group">
           
            <input type="number" class="form-control border-0" placeholder="Tamaño m cuadrados" required="required" name="tamano_m_cuadrados" value={departamento.tamano_m_cuadrados} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" class="form-control border-0" name="aceptan_gatos" checked={departamento.aceptan_gatos} onChange={handleChange} />
              Aceptan Gatos
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" class="form-control border-0" name="aceptan_perros" checked={departamento.aceptan_perros} onChange={handleChange} />
              Aceptan Perros
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" class="form-control border-0" name="lavanderia" checked={departamento.lavanderia} onChange={handleChange} />
              Lavandería
            </label>
          </div>

          <div className="form-group">
            <label>Imagen</label>
            <input type="file" class="form-control border-0" name="imagen" onChange={handleImageChange} />
          </div>

          <button type="submit" className=" btn btn-lg btn-primary btn-block border-0 text-white ">Crear Departamento</button>
        </form>
        </div>
     
      </div>
    </div>
  );
};

export default CrearDepartamento;
