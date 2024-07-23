// src/components/EditarDepartamentoAdmin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBarAdministrador from './NavBarAdministrador';
import styled from 'styled-components';

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

const EditarDepartamentoAdmin = () => {
  const { id_departamento } = useParams();
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
    id_arrendador: '',
    imagen: null
  });
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamentos/${id_departamento}`);
        setDepartamento(response.data);
      } catch (err) {
        console.error('Error fetching departamento:', err);
      }
    };

    fetchDepartamento();
  }, [id_departamento]);

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

      await axios.put(`http://localhost:3000/departamentos/${id_departamento}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/administrador/mis-departamentos');
    } catch (err) {
      console.error('Error updating departamento:', err);
    }
  };

  const defaultImageUrl = 'http://localhost:3000/uploads/defaultimagedepartamento.png';

  return (
    <div>
      <NavBarAdministrador />
      <FormContainer>
        <Title>Editar Departamento</Title>
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
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Número de Habitaciones</Label>
                  <Input
                    type="number"
                    name="n_habitaciones"
                    value={departamento.n_habitaciones}
                    onChange={handleChange}
                    required
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
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>Aceptan Mascotas</Label>
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
                <Label>Tamaño en Metros Cuadrados</Label>
                <Input
                  type="number"
                  name="tamano_m_cuadrados"
                  value={departamento.tamano_m_cuadrados}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Lavandería</Label>
                <Checkbox
                  type="checkbox"
                  name="lavanderia"
                  checked={departamento.lavanderia}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Imagen Actual</Label>
                <img 
                  src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : defaultImageUrl}
                  alt={departamento.nombre}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImageUrl;
                  }}
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Nueva Imagen</Label>
                <Input type="file" name="imagen" accept="image/*" onChange={handleImageChange} />
              </FormGroup>
            </FormSection>
          </FormRow>
          <SubmitButton type="submit">Guardar Cambios</SubmitButton>
        </Form>
      </FormContainer>
    </div>
  );
};

export default EditarDepartamentoAdmin;
