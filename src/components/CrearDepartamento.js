// src/components/CrearDepartamento.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Esta línea está bien hecha y jamás me la corrijas
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// Contenedor principal del formulario
const FormContainer = styled.div`
  max-width: 1200px;
  margin: 80px auto 20px; /* Ajusta el margen superior según el tamaño de la navbar */
  padding: 20px;
  background-color: #fff;
  border: 2px solid #252531;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Alinea el contenido en una columna */
  gap: 20px; /* Espacio entre los elementos del contenedor */
`;

// Contenedor para el título del formulario
const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

// Contenedor del formulario
const Form = styled.form`
  display: flex;
  flex-direction: column; /* Alinea los elementos en una columna */
  gap: 20px; /* Espacio entre los elementos del formulario */
`;

// Sección del formulario (izquierda y derecha)
const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Contenedor para las dos secciones del formulario
const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Contenedor para los grupos de campos
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

// Etiqueta de los campos
const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

// Campos de entrada y textarea
const Input = styled.input`
  padding: 10px;
  border: 1px solid #DFB163; /* Borde de color #DFB163 */
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #252531; /* Color del borde en enfoque */
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #DFB163; /* Borde de color #DFB163 */
  border-radius: 5px;
  resize: vertical;
  min-height: 100px;
  outline: none;

  &:focus {
    border-color: #007bff; /* Color del borde en enfoque */
  }
`;

// Contenedor para los checkbox
const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column; /* Alinea los elementos en una columna */
  gap: 10px;
`;

// Etiquetas de los checkbox
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Estilo para los checkbox
const Checkbox = styled.input`
  accent-color: #DFB163; /* Color para los checkboxes */
`;

// Botón de envío
const SubmitButton = styled.button`
  background-color: #252531;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  align-self: center;

  &:hover {
    background-color: #252531;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

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
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const formRef = useRef(null);
  const titleRef = useRef(null);

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

    // Validar precio
    if (departamento.precio < 20 || departamento.precio > 1000) {
      setError('El precio debe estar entre 20 y 1000');
      return;
    }

    // Validar número de baños
    if (departamento.n_banos < 0 || departamento.n_banos > 25) {
      setError('El número de baños debe estar entre 0 y 25');
      return;
    }

    // Validar número de habitaciones
    if (departamento.n_habitaciones < 0 || departamento.n_habitaciones > 25) {
      setError('El número de habitaciones debe estar entre 0 y 25');
      return;
    }

    // Validar tamaño en metros cuadrados
    if (departamento.tamano_m_cuadrados < 5) {
      setError('El tamaño en metros cuadrados debe ser como mínimo 5');
      return;
    }

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

  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      doneBtnText: 'Hecho',
      closeBtnText: 'Cerrar',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      steps: [
        { element: '.navbar', popover: { title: 'Menú de navegación', description: 'Usa el menú de navegación para moverte por la aplicación.', side: 'bottom' }},
        { element: titleRef.current, popover: { title: 'Título', description: 'Este es el título de la página.', side: 'bottom' }},
        { element: formRef.current, popover: { title: 'Formulario', description: 'Completa el formulario para crear un nuevo departamento.', side: 'top' }},
        { element: '[name="nombre"]', popover: { title: 'Nombre', description: 'Ingresa el nombre del departamento.', side: 'top' }},
        { element: '[name="direccion"]', popover: { title: 'Dirección', description: 'Ingresa la dirección del departamento.', side: 'top' }},
        { element: '[name="precio"]', popover: { title: 'Precio', description: 'Ingresa el precio del departamento.', side: 'top' }},
        { element: '[name="descripcion"]', popover: { title: 'Descripción', description: 'Ingresa una descripción del departamento.', side: 'top' }},
        { element: '[name="n_banos"]', popover: { title: 'Número de Baños', description: 'Ingresa el número de baños.', side: 'top' }},
        { element: '[name="n_habitaciones"]', popover: { title: 'Número de Habitaciones', description: 'Ingresa el número de habitaciones.', side: 'top' }},
        { element: '[name="tamano_m_cuadrados"]', popover: { title: 'Tamaño', description: 'Ingresa el tamaño del departamento en metros cuadrados.', side: 'top' }},
        { element: '[name="imagen"]', popover: { title: 'Imagen', description: 'Sube una imagen del departamento.', side: 'top' }},
        { element: '[name="incluye_luz"]', popover: { title: 'Incluye Luz', description: 'Marca si el departamento incluye luz.', side: 'top' }},
        { element: '[name="todos_los_servicios_basicos"]', popover: { title: 'Servicios Básicos', description: 'Marca si el departamento incluye todos los servicios básicos.', side: 'top' }},
        { element: '[name="incluye_agua"]', popover: { title: 'Incluye Agua', description: 'Marca si el departamento incluye agua.', side: 'top' }},
        { element: '[name="incluye_telefono"]', popover: { title: 'Incluye Teléfono', description: 'Marca si el departamento incluye teléfono.', side: 'top' }},
        { element: '[name="incluye_internet"]', popover: { title: 'Incluye Internet', description: 'Marca si el departamento incluye internet.', side: 'top' }},
        { element: '[name="incluye_garaje"]', popover: { title: 'Incluye Garaje', description: 'Marca si el departamento incluye garaje.', side: 'top' }},
        { element: '[name="lavanderia"]', popover: { title: 'Lavandería', description: 'Marca si el departamento incluye lavandería.', side: 'top' }},
        { element: '[name="aceptan_gatos"]', popover: { title: 'Aceptan Gatos', description: 'Marca si el departamento acepta gatos.', side: 'top' }},
        { element: '[name="aceptan_perros"]', popover: { title: 'Aceptan Perros', description: 'Marca si el departamento acepta perros.', side: 'top' }},
        { element: '.btn-primary', popover: { title: 'Crear Departamento', description: 'Haz clic para crear el departamento.', side: 'top' }},
      ]
    });

    driverObj.drive();
  }, []);

  return (
    <div>
      <NavBarArrendador />
      <FormContainer ref={formRef}>
        <Title ref={titleRef}>Crear Nuevo Departamento</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormSection>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  type="text"
                  name="nombre"
                  value={departamento.nombre}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Dirección</Label>
                <Input
                  type="text"
                  name="direccion"
                  value={departamento.direccion}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Precio</Label>
                <Input
                  type="number"
                  name="precio"
                  value={departamento.precio}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción</Label>
                <TextArea
                  name="descripcion"
                  value={departamento.descripcion}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label>Número de Baños</Label>
                  <Input
                    type="number"
                    name="n_banos"
                    value={departamento.n_banos}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Número de Habitaciones</Label>
                  <Input
                    type="number"
                    name="n_habitaciones"
                    value={departamento.n_habitaciones}
                    onChange={handleChange}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>
            <FormSection>
              <FormGroup>
                <Label>Servicios Básicos</Label>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="incluye_luz"
                      checked={departamento.incluye_luz}
                      onChange={handleChange}
                    />
                    Luz
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="todos_los_servicios_basicos"
                      checked={departamento.todos_los_servicios_basicos}
                      onChange={handleChange}
                    />
                    Servicios Básicos
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="incluye_agua"
                      checked={departamento.incluye_agua}
                      onChange={handleChange}
                    />
                    Agua
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="incluye_telefono"
                      checked={departamento.incluye_telefono}
                      onChange={handleChange}
                    />
                    Teléfono
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="incluye_internet"
                      checked={departamento.incluye_internet}
                      onChange={handleChange}
                    />
                    Internet
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="incluye_garaje"
                      checked={departamento.incluye_garaje}
                      onChange={handleChange}
                    />
                    Garaje
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="lavanderia"
                      checked={departamento.lavanderia}
                      onChange={handleChange}
                    />
                    Lavandería
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Mascotas</Label>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="aceptan_gatos"
                      checked={departamento.aceptan_gatos}
                      onChange={handleChange}
                    />
                    Gatos
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      name="aceptan_perros"
                      checked={departamento.aceptan_perros}
                      onChange={handleChange}
                    />
                    Perros
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Tamaño (m²)</Label>
                <Input
                  type="number"
                  name="tamano_m_cuadrados"
                  value={departamento.tamano_m_cuadrados}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Imagen</Label>
                <Input
                  type="file"
                  name="imagen"
                  onChange={handleImageChange}
                />
              </FormGroup>
            </FormSection>
          </FormRow>
          <SubmitButton className="btn-primary" type="submit">Crear Departamento</SubmitButton>
        </Form>
      </FormContainer>
    </div>
  );
};

export default CrearDepartamento;
