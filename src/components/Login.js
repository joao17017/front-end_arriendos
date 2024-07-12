import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import departamentoImage from "../imag/Departamento.jpg";
import NavBar from "./NavBar";

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
    border-color: #007bff;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  background: white;
  padding: 0 0.25rem;
  color: #6c757d;
  transition: all 0.2s;

  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ & {
    top: -0.5rem;
    left: 0.75rem;
    font-size: 0.75rem;
    color: #007bff;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const Text = styled.p`
  margin-top: 1rem;
  text-align: center;

  .span {
    color: #007bff;
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
            <Button type="submit">Login</Button>
            <Text>
              ¿Olvidaste tu contraseña?{" "}
              <Link to="/forgot-password" className="span">
                Haz clic aquí
              </Link>
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
    </LoginPage>
  );
};

export default Login;
