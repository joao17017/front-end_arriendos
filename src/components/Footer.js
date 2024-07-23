import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

// Styled components
const FooterContainer = styled.div`
  background-color: #252531;
  color: white;
  padding: 5rem 1.5rem 1rem; // Ajustar el padding inferior
`;

const FooterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FooterColumn = styled.div`
  flex: 1;
  max-width: 25%;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    max-width: 50%;
  }

  @media (max-width: 576px) {
    max-width: 100%;
  }
`;

const FooterTitle = styled.h4`
  color: #DFB163;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    color: #DEB063;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  justify-content: center; 
  margin-top: 1rem;
`;

const SocialButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  margin: 0 0.5rem; // Ajusta el espaciado horizontal
  color: white;
  border: 1px solid white;
  border-radius: 50%;
  text-align: center;
  text-decoration: none;

  &:hover {
    color: #DFB163;
    border-color: #DFB163;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormInput = styled.input`
  border: none;
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #DFB163;
  color: white;
  padding: 1rem;
  border: none;
  cursor: pointer;
`;

const FooterBottom = styled.div`
  border-top: 1px solid #DFB163;
  padding-top: 0.5rem; // Reducir el padding superior
  padding-bottom: 0; // Eliminar el padding inferior
  margin-bottom: 0; // Eliminar el margen inferior si es necesario
  line-height: 1.2; // Ajustar la altura de línea
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterRow>
        <FooterColumn>
          <FooterTitle>Kevin Mullo</FooterTitle>
          <p><FaMapMarkerAlt /> ESPOCH</p>
          <p><FaPhoneAlt /> +593 980124010</p>
          <p><FaEnvelope /> alexsander.mullo@espoch.edu.ec</p>
          <SocialButtonsContainer>
            <SocialButton href="#"><FaTwitter /></SocialButton>
            <SocialButton href="#"><FaFacebookF /></SocialButton>
            <SocialButton href="#"><FaLinkedinIn /></SocialButton>
            <SocialButton href="#"><FaInstagram /></SocialButton>
          </SocialButtonsContainer>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Bernarda Morales</FooterTitle>
          <p><FaMapMarkerAlt /> ESPOCH</p>
          <p><FaPhoneAlt /> +593 983761394</p>
          <p><FaEnvelope /> bernarda.morales@espoch.edu.ec</p>
          <SocialButtonsContainer>
            <SocialButton href="#"><FaTwitter /></SocialButton>
            <SocialButton href="#"><FaFacebookF /></SocialButton>
            <SocialButton href="#"><FaLinkedinIn /></SocialButton>
            <SocialButton href="#"><FaInstagram /></SocialButton>
          </SocialButtonsContainer>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Joao Barrionuevo</FooterTitle>
          <p><FaMapMarkerAlt /> ESPOCH</p>
          <p><FaPhoneAlt /> +593 959773968</p>
          <p><FaEnvelope /> adrian.barrionuevo@espoch.edu.ec</p>
          <SocialButtonsContainer>
            <SocialButton href="#"><FaTwitter /></SocialButton>
            <SocialButton href="#"><FaFacebookF /></SocialButton>
            <SocialButton href="#"><FaLinkedinIn /></SocialButton>
            <SocialButton href="#"><FaInstagram /></SocialButton>
          </SocialButtonsContainer>
        </FooterColumn>
      </FooterRow>
      <FooterBottom>
        <p>
          &copy; <a href="#" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>RioArriendos</a>. Todos los Derechos Reservados. Diseñado por Grupo 8
        </p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
