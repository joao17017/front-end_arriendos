import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarArrendador from './NavBarArrendador';
import './EditarDepartamento.css';

const EditarDepartamento = () => {
  const { id_departamento } = useParams();
  const [departamento, setDepartamento] = useState({
    id_departamento: '',
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
    id_arrendador: '',
    imagen: null
  });
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(`http://localhost:3000/departamentos/${id_departamento}`);
        if (response.data.id_arrendador !== id_arrendador) {
          console.error('Access denied');
          navigate('/');
          return;
        }
        setDepartamento(response.data);
      } catch (err) {
        console.error('Error fetching departamento:', err);
        navigate('/');
      }
    };

    fetchDepartamento();
  }, [id_departamento, navigate]);

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

      await axios.put(`http://localhost:3000/departamentos/${id_departamento}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/arrendador/mis-departamentos');
    } catch (err) {
      console.error('Error updating departamento:', err);
    }
  };

  return (
    <div>
      <NavBarArrendador />
      <div className="edit-container col-lg-8 col-md-10 mb-5 mx-auto" style={{ backgroundColor: '#252531', padding: '20px', borderRadius: '10px', color: 'white' }}>
        <h4 className="text-primary mb-4">Editar Departamento</h4>
        <form onSubmit={handleSubmit} className="edit-form">
          <input type="hidden" name="id_departamento" value={departamento.id_departamento} />
          <input type="hidden" name="id_arrendador" value={departamento.id_arrendador} />

          <div className="form-group">
            <input type="text" className="form-control border-0" placeholder="Nombre" name="nombre" value={departamento.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="text" className="form-control border-0" placeholder="Dirección" name="direccion" value={departamento.direccion} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="number" className="form-control border-0" placeholder="Precio" name="precio" value={departamento.precio} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <textarea className="form-control border-0" placeholder="Descripción" name="descripcion" value={departamento.descripcion} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="incluye_luz" checked={departamento.incluye_luz} onChange={handleChange} />
              Incluye Luz
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="todos_los_servicios_basicos" checked={departamento.todos_los_servicios_basicos} onChange={handleChange} />
              Todos los Servicios Básicos
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="incluye_agua" checked={departamento.incluye_agua} onChange={handleChange} />
              Incluye Agua
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="incluye_telefono" checked={departamento.incluye_telefono} onChange={handleChange} />
              Incluye Teléfono
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="incluye_internet" checked={departamento.incluye_internet} onChange={handleChange} />
              Incluye Internet
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="incluye_garaje" checked={departamento.incluye_garaje} onChange={handleChange} />
              Incluye Garaje
            </label>
          </div>
          <div className="form-group">
            <input type="number" className="form-control border-0" placeholder="Número de Baños" name="n_banos" value={departamento.n_banos} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="number" className="form-control border-0" placeholder="Número de Habitaciones" name="n_habitaciones" value={departamento.n_habitaciones} onChange={handleChange} />
          </div>
          <div className="form-group">
            <input type="number" className="form-control border-0" placeholder="Tamaño en m²" name="tamano_m_cuadrados" value={departamento.tamano_m_cuadrados} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="aceptan_gatos" checked={departamento.aceptan_gatos} onChange={handleChange} />
              Aceptan Gatos
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="aceptan_perros" checked={departamento.aceptan_perros} onChange={handleChange} />
              Aceptan Perros
            </label>
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" className="form-control border-0" name="lavanderia" checked={departamento.lavanderia} onChange={handleChange} />
              Lavandería
            </label>
          </div>

          <div className="form-group">
            <label>Imagen Actual</label>
            {departamento.imagen && (
              <img
                src={`http://localhost:3000/${departamento.imagen}`}
                alt={departamento.nombre}
                className="departamento-image"
              />
            )}
          </div>
          <div className="form-group">
            <label>Nueva Imagen</label>
            <input type="file" className="form-control border-0" name="imagen" onChange={handleImageChange} />
          </div>

          <button type="submit" className="btn btn-lg btn-primary btn-block border-0 text-white">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditarDepartamento;
