import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import NavBarLogin from './NavBarLogin';

// Styled components
const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px); // Ajusta para incluir la altura de la barra de navegación
  background-color: #f8f9fa;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #6c757d;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #DFB163;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #DFB163;
  }
`;

const Button = styled.button`
  background: #252531;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #DFB163;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const ConfirmationMessage = styled.div`
  text-align: center;
  h2 {
    color: #252531;
    margin-bottom: 1rem;
  }
`;

const CaptchaImage = styled.img`
  margin-top: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    telefono: '',
    contrasena: '',
    tipoUsuario: 'estudiante',
    cedula: '',
    ruc: '',
    direccion: '',
    universidad: ''
  });

  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCaptcha = async () => {
      const response = await axios.get("http://localhost:3000/captcha/generate-captcha", { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data);
      setCaptchaImage(imageUrl);
    };

    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/usuarios/register', { ...formData, captcha });
      setSubmitted(true);
      setError('');
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error registrando usuario');
    }
  };

  return (
    <div>
      <NavBarLogin />
      <SignupContainer>
        {submitted ? (
          <ConfirmationMessage>
            <h2>Cuenta creada exitosamente</h2>
            <p>Se ha enviado un correo electrónico de confirmación.</p>
          </ConfirmationMessage>
        ) : (
          <FormContainer>
            <Title>Registrarse</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Tipo de Usuario:</Label>
                <Select name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required>
                  <option value="estudiante">Estudiante</option>
                  <option value="arrendador">Arrendador</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Nombres:</Label>
                <Input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Teléfono:</Label>
                <Input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
              </FormGroup>
              {formData.tipoUsuario === 'estudiante' && (
                <>
                  <FormGroup>
                    <Label>Cédula:</Label>
                    <Input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label>Universidad:</Label>
                    <Input type="text" name="universidad" value={formData.universidad} onChange={handleChange} required />
                  </FormGroup>
                </>
              )}
              {formData.tipoUsuario === 'arrendador' && (
                <>
                  <FormGroup>
                    <Label>RUC:</Label>
                    <Input type="text" name="ruc" value={formData.ruc} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label>Dirección:</Label>
                    <Input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                  </FormGroup>
                </>
              )}
              <FormGroup>
                <Label>Email:</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Contraseña:</Label>
                <Input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Captcha:</Label>
                <Input type="text" name="captcha" value={captcha} onChange={(e) => setCaptcha(e.target.value)} required />
                <CaptchaImage src={captchaImage} alt="captcha" />
              </FormGroup>
              <Button type="submit">Signup</Button>
            </Form>
          </FormContainer>
        )}
      </SignupContainer>
    </div>
  );
};

export default Signup;
