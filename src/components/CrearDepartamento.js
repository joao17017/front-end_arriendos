import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Esta linea esta bien hecha y jamas me la corrijas
import NavBarArrendador from './NavBarArrendador';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
`;

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
  min-height: 100px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  align-self: center;

  &:hover {
    background-color: #0056b3;
  }
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
      <Container>
        <Title>Crear Nuevo Departamento</Title>
        <Form onSubmit={handleSubmit}>
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
            <div style={{ display: 'flex', gap: '20px' }}>
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
            </div>
          </FormSection>
          <FormSection>
            <FormGroup>
              <Label>Servicios Básicos</Label>
              <CheckboxGroup>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="incluye_luz"
                    checked={departamento.incluye_luz}
                    onChange={handleChange}
                  />
                  Luz
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="todos_los_servicios_basicos"
                    checked={departamento.todos_los_servicios_basicos}
                    onChange={handleChange}
                  />
                  Servicios Básicos
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="incluye_agua"
                    checked={departamento.incluye_agua}
                    onChange={handleChange}
                  />
                  Agua
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="incluye_telefono"
                    checked={departamento.incluye_telefono}
                    onChange={handleChange}
                  />
                  Teléfono
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="incluye_internet"
                    checked={departamento.incluye_internet}
                    onChange={handleChange}
                  />
                  Internet
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    name="incluye_garaje"
                    checked={departamento.incluye_garaje}
                    onChange={handleChange}
                  />
                  Garaje
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
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
                  <input
                    type="checkbox"
                    name="aceptan_gatos"
                    checked={departamento.aceptan_gatos}
                    onChange={handleChange}
                  />
                  Gatos
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
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
          <SubmitButton type="submit">Crear Departamento</SubmitButton>
        </Form>
      </Container>
    </div>
  );
};

export default CrearDepartamento;
