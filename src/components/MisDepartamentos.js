import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarArrendador from "./NavBarArrendador";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt, FaRegPaperPlane } from 'react-icons/fa';
import './MisDepartamentos.css';

const MisDepartamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }
                const decoded = jwtDecode(token);
                const id_arrendador = decoded.id;
                const response = await axios.get(
                    `http://localhost:3000/departamentos/arrendador/${id_arrendador}`
                );
                setDepartamentos(response.data);
            } catch (err) {
                console.error("Error fetching departamentos:", err);
            }
        };
        fetchDepartamentos();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/departamentos/${id}`);
            setDepartamentos(departamentos.filter((depto) => depto.id_departamento !== id));
        } catch (err) {
            console.error("Error deleting departamento:", err);
        }
    };

    const handleSolicitarActivacion = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const id_arrendador = decoded.id;

            await axios.post(
                "http://localhost:3000/solicitudes-activacion",
                { id_arrendador, id_departamento: id },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            alert("Solicitud de activación enviada");
        } catch (err) {
            console.error("Error al solicitar activación:", err);

            // Mostrar el mensaje de error si existe
            if (err.response && err.response.data && err.response.data.error) {
                alert(`Error: ${err.response.data.error}`);
            } else {
                alert("Error al solicitar activación");
            }
        }
    };

    const handleDepartamentoClick = (id_departamento_activo) => {
        navigate(`/departamentos/${id_departamento_activo}`);
    };

    return (
        <div>
            <NavBarArrendador />
            <div className="container mt-4">
                <h1 className="mb-4">Mis Departamentos</h1>
                <div className="row mx-1 portfolio-container">
                    {departamentos.map((departamento) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 p-0 portfolio-item" key={departamento.id_departamento}>
                            <div className="position-relative overflow-hidden">
                                <div className="portfolio-img d-flex align-items-center justify-content-center">
                                    <img
                                        src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : "/images/default-image.png"}
                                        alt={departamento.nombre}
                                        className="img-fluid"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="portfolio-text bg-secondary d-flex flex-column align-items-center justify-content-center">
                                    <h4 className="text-white mb-4">{departamento.nombre}</h4>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Link
                                            to={`./${departamento.id_departamento}`}
                                            className="btn btn-outline-primary m-1"
                                        >
                                            <FaEye />
                                        </Link>
                                        <Link
                                            to={`/departamentos/editar/${departamento.id_departamento}`}
                                            className="btn btn-outline-primary m-1"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <a
                                            className="btn btn-outline-primary m-1"
                                            href="#"
                                            onClick={() => handleDelete(departamento.id_departamento)}
                                        >
                                            <FaTrashAlt />
                                        </a>
                                        <a
                                            className="btn btn-outline-primary m-1"
                                            href="#"
                                            onClick={() => handleSolicitarActivacion(departamento.id_departamento)}
                                        >
                                            <FaRegPaperPlane />
                                        </a>
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

export default MisDepartamentos;
