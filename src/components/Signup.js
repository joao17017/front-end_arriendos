import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import NavBarLogin from './NavBarLogin';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

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

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  &:hover {
    background-color: #0056b3;
  }
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

  const handleTour = () => {
    const steps = [
      { element: 'form', popover: { title: 'Formulario de Registro', description: 'Complete los campos para registrarse.', side: 'top' }},
      { element: 'select[name="tipoUsuario"]', popover: { title: 'Tipo de Usuario', description: 'Seleccione el tipo de usuario: Estudiante o Arrendador.', side: 'top' }},
      { element: 'input[name="nombres"]', popover: { title: 'Nombres', description: 'Ingrese sus nombres completos.', side: 'top' }},
      { element: 'input[name="telefono"]', popover: { title: 'Teléfono', description: 'Ingrese su número de teléfono, debe tener 10 digitos.', side: 'top' }},
      { element: 'input[name="email"]', popover: { title: 'Email', description: 'Ingrese su dirección de correo electrónico.', side: 'top' }},
      { element: 'input[name="contrasena"]', popover: { title: 'Contraseña', description: 'Ingrese una contraseña segura,debe tener 8 digitos como minimo y una letra mayuscula.', side: 'top' }},
      { element: 'input[name="captcha"]', popover: { title: 'Captcha', description: 'Ingrese el texto del captcha para verificar,el que se encuentra abajo.', side: 'top' }},
      { element: 'button[type="submit"]', popover: { title: 'Registrarse', description: 'Haga clic aquí para completar el registro.', side: 'top' }}
    ];

    if (formData.tipoUsuario === 'estudiante') {
      steps.splice(4, 0, { element: 'input[name="cedula"]', popover: { title: 'Cédula', description: 'Ingrese su número de cédula, debe tener 10 digitos.', side: 'top' }});
    } else if (formData.tipoUsuario === 'arrendador') {
      steps.splice(4, 0, { element: 'input[name="ruc"]', popover: { title: 'RUC', description: 'Ingrese su número de RUC, debe tener 13 digitos y su actividad debe estar relacionada con Alquiler de Propiedades.', side: 'top' }});
    }

    const driverObj = driver({
      showProgress: true,
      doneBtnText: 'Hecho',
      closeBtnText: 'Cerrar',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      steps: steps
    });

    driverObj.drive();
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
              <Button type="submit">Registrarse</Button>
            </Form>
          </FormContainer>
        )}
      </SignupContainer>
      <FloatingButton onClick={handleTour}>❓</FloatingButton>
    </div>
  );
};

export default Signup;
