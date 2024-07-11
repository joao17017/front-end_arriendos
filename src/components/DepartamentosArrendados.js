import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavBarArrendador from './NavBarArrendador';
import './DepartamentosArrendados.css'; // Asegúrate de tener un archivo CSS
import { FaUser, FaHome, FaAddressCard, FaHandHoldingUsd, FaUserTie } from 'react-icons/fa';


const DepartamentosArrendados = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/');
          return;
        }

        const decoded = jwtDecode(token);
        const id_arrendador = decoded.id;

        const response = await axios.get(`http://localhost:3000/departamentos-arrendados/lista/${id_arrendador}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDepartamentos(response.data);
      } catch (err) {
        console.error('Error fetching departamentos arrendados:', err);
      }
    };

    fetchDepartamentos();
  }, [navigate]);

  const handleComentar = (id_departamento) => {
    console.log('Comentar:', id_departamento);
  };

  const handleEliminar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/departamentos-arrendados/${id_departamento_arrendado}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log('Departamento eliminado:', id_departamento_arrendado);
    } catch (err) {
      console.error('Error eliminando departamento arrendado:', err);
    }
  };

  const handleDesocupar = async (id_departamento_arrendado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/departamentos-arrendados/desocupar/${id_departamento_arrendado}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartamentos(departamentos.filter(dep => dep.id_DepartamentoArrendado !== id_departamento_arrendado));
      console.log('Departamento desocupado:', id_departamento_arrendado);
    } catch (err) {
      console.error('Error desocupando departamento arrendado:', err);
    }
  };

  return (
    <div>
      <NavBarArrendador />
      <div className="container-fluid bg-light">
        <div className="container">
          <h1 className="mb-5" style={{ color: 'var(--custom-color)' }}>Departamentos Arrendados</h1>
          {departamentos.map((departamento) => (
            <div className="row mb-5" key={departamento.id_departamento}>
              <div className="col-lg-12 d-flex">
                <div className="col-lg-5">
                  <div className="d-flex flex-column align-items-center justify-content-center bg-primary h-100 py-5 px-3">
                    <img
                      src={departamento.Departamento.imagen ? `http://localhost:3000/${departamento.Departamento.imagen}` : "/images/default-image.png"}
                      alt={departamento.Departamento.nombre}
                      className="img-fluid"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="col-lg-7 d-flex flex-column justify-content-center">
                  <h6 className="text-primary font-weight-normal text-uppercase mb-3">RIO ARRIENDOS</h6>
                  <h1 className="mb-4 section-title">Departamento ID: {departamento.id_departamento}</h1>
                  <p>{departamento.Departamento.descripcion}</p>
                  <div className="row py-2">
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center mb-4">
                        <FaUser className="text-primary m-0 mr-3" />
                        <h5 className="text-truncate m-0">Usuario ID: {departamento.id_usuario}</h5>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center mb-4">
                        <FaHome className="text-primary m-0 mr-3" />
                        <h5 className="text-truncate m-0">Arrendador ID: {departamento.id_arrendador}</h5>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center mb-4">
                        <FaAddressCard className="text-primary m-0 mr-3" />
                        <h5 className="text-truncate m-0">Dirección: {departamento.Departamento.direccion}</h5>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center mb-4">
                        <FaHandHoldingUsd className="text-primary m-0 mr-3" />
                        <h5 className="text-truncate m-0">Arrendado a: {departamento.Usuario.nombres}</h5>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center mb-4">
                        <FaUserTie className="text-primary m-0 mr-3" />
                        <h5 className="text-truncate m-0">Arrendado por: {departamento.Arrendador.nombres}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <button className="btn btn-primary mr-3" onClick={() => handleComentar(departamento.id_departamento)}>
                      Comentar
                    </button>
                    <button className="btn btn-danger mr-3" onClick={() => handleEliminar(departamento.id_DepartamentoArrendado)}>
                      Eliminar
                    </button>
                    <button className="btn btn-warning" onClick={() => handleDesocupar(departamento.id_DepartamentoArrendado)}>
                      Desocupar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartamentosArrendados;
