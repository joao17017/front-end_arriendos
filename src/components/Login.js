import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
import departamentoImage from "../imag/Departamento.jpg";
import NavBar from "./NavBar";

Modal.setAppElement("#root");

// Styled components
const LoginPage = styled.div`
  background-color: #f8f9fa;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px); // Ajusta para incluir la altura de la barra de navegación
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const LoginInfoContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 1rem;
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-align: center;
  color: #252531; // Color del título
`;

const InputsContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #252531; // Color del borde al enfocar
  }
`;

const Label = styled.label`
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  background: white;
  padding: 0 0.25rem;
  color: #252531; // Color del texto de la etiqueta
  transition: all 0.2s;

  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ & {
    top: -0.5rem;
    left: 0.75rem;
    font-size: 0.75rem;
    color: #252531; // Color del texto de la etiqueta cuando está enfocado
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: #252531; // Color de fondo del botón
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1c1c1c; // Color del botón al pasar el cursor
  }
`;

const Text = styled.p`
  margin-top: 1rem;
  text-align: center;

  .span {
    color: #252531; // Color del texto del enlace
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 1rem;

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const LoginImage = styled.img`
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  margin: auto;

  @media (min-width: 768px) {
    width: 80%;
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #252531; // Color del título en el modal
`;

const CaptchaImage = styled.img`
  margin-top: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const CloseButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;

  &:hover {
    background: #c82333;
  }
`;

const NotificationModal = styled(ModalContent)`
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaptcha = async () => {
      const response = await axios.get("http://localhost:3000/captcha/generate-captcha", { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data);
      setCaptchaImage(imageUrl);
    };

    if (isModalOpen) {
      fetchCaptcha();
    }
  }, [isModalOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        contrasena: password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", response.data.tipo);

      switch (response.data.tipo) {
        case "estudiante":
          navigate("/estudiante/dashboard");
          break;
        case "arrendador":
          navigate("/arrendador/dashboard");
          break;
        case "administrador":
          navigate("/administrador/dashboard");
          break;
        default:
          setError("Tipo de usuario no reconocido");
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/usuarios/recuperar-contrasena", {
        email: resetEmail,
        captcha,
      });
      setResetMessage(response.data.message);
      if (response.status === 200) {
        setIsModalOpen(false);
        setIsNotificationOpen(true);
      }
    } catch (err) {
      setResetMessage("Error al enviar el correo de recuperación");
    }
  };

  return (
    <LoginPage>
      <NavBar />
      <LoginContainer>
        <LoginInfoContainer>
          <Title>Iniciar Sesión</Title>
          <InputsContainer onSubmit={handleLogin}>
            <InputContainer>
              <Input
                type="text"
                placeholder=" "
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Label htmlFor="email">Correo Electrónico</Label>
            </InputContainer>
            <InputContainer>
              <Input
                type="password"
                placeholder=" "
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Label htmlFor="password">Contraseña</Label>
            </InputContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button type="submit">Iniciar Sesión</Button>
            <Text>
              ¿Olvidaste tu contraseña?{" "}
              <span className="span" onClick={() => setIsModalOpen(true)}>
                Haz clic aquí
              </span>
            </Text>
            <Text>
              ¿No tiene una cuenta aún?{" "}
              <Link to="/signup" className="span">
                Regístrate
              </Link>
            </Text>
          </InputsContainer>
        </LoginInfoContainer>
        <ImageContainer>
          <LoginImage src={departamentoImage} alt="Departamento" />
        </ImageContainer>
      </LoginContainer>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={{ overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, content: { inset: 'auto' } }}>
        <ModalContent>
          <ModalTitle>Recuperar Contraseña</ModalTitle>
          <form onSubmit={handlePasswordReset}>
            <InputContainer>
              <Input
                type="text"
                placeholder=" "
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <Label htmlFor="resetEmail">Correo Electrónico</Label>
            </InputContainer>
            <InputContainer>
              <Input
                type="text"
                placeholder=" "
                id="captcha"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
              <Label htmlFor="captcha">Captcha</Label>
              <CaptchaImage src={captchaImage} alt="captcha" />
            </InputContainer>
            {resetMessage && <ErrorMessage>{resetMessage}</ErrorMessage>}
            <Button type="submit">Enviar</Button>
            <CloseButton onClick={() => setIsModalOpen(false)}>Cerrar</CloseButton>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isNotificationOpen} onRequestClose={() => setIsNotificationOpen(false)} style={{ overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center' }, content: { inset: 'auto' } }}>
        <NotificationModal>
          <ModalTitle>Notificación</ModalTitle>
          <p>Se ha enviado una nueva contraseña al correo si este está registrado en el sistema</p>
          <Button onClick={() => setIsNotificationOpen(false)}>Cerrar</Button>
        </NotificationModal>
      </Modal>
    </LoginPage>
  );
};

export default Login;
