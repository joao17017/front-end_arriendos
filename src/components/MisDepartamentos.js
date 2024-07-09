import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarArrendador from "./NavBarArrendador";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

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
                { headers: { Authorization: token } }
            );
            alert("Solicitud de activación enviada");
        } catch (err) {
            console.error("Error al solicitar activación:", err);
        }
    };

    return (
        <div>
            <NavBarArrendador />
            <div className="container mt-4">
                <h1 className="mb-4">Mis Departamentos</h1>
                <div className="row">
                    {departamentos.map((departamento) => (
                        <div className="col-md-4 mb-4" key={departamento.id_departamento}>
                            <div className="card text-white" style={{ backgroundColor: '#DFB163', border: '2px solid black' }}>
                                <img
                                    src={departamento.imagen ? `http://localhost:3000/${departamento.imagen}` : "/images/default-image.png"}
                                    alt={departamento.nombre}
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{departamento.nombre}</h5>
                                    <p className="card-text">{departamento.descripcion}</p>
                                </div>

                                <div className="card-footer" style={{ backgroundColor: '#252531' }}> 
                                    <nav className="nav justify-content-around">
                                        <Link
                                            to={`/departamentos/editar/${departamento.id_departamento}`}
                                            className="nav-link text-white small"
                                        >
                                            Editar
                                        </Link>
                                        <Link
                                            to="#"
                                            className="nav-link text-white small"
                                            onClick={() => handleDelete(departamento.id_departamento)}
                                        >
                                            Eliminar
                                        </Link>
                                        <Link
                                            to={`/departamentos/${departamento.id_departamento}`}
                                            className="nav-link text-white small"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            to="#"
                                            className="nav-link text-white small"
                                            onClick={() => handleSolicitarActivacion(departamento.id_departamento)}
                                        >
                                            Solicitar
                                        </Link>
                                    </nav>
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
