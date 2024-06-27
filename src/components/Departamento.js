import React, { useState } from "react";
import axios from "../api/axiosConfig";
import "./Signup.css";
import NavBar from "./NavBar";

const Departamento = () => {
  const [formData, setFormData] = useState({
    id_arrendador:"",
    nombre: "",
    direccion: "",
    precio: "",
    descripcion: "",
    incluye_luz: "",
    incluye_agua: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/departamentos", formData);
      setSubmitted(true);
      setError("");
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error registrando usuario");
    }
  };

  return (
    <div>
      <NavBar />

      <div className="signup-container">
        {submitted ? (
          <div className="confirmation-message">
            <h2>Departamento Creado Exitosamento</h2>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Departamento</h2>
            {error && <p className="error">{error}</p>}

            <div className="form-group">
              <label>arrendador:</label>
              <input
                type="text"
                name="id_arrendador"
                value={formData.id_arrendador}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nombres:</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>direccion:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripcion:</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="incluye_luz">Incluye Luz:</label>
              <select
                id="incluye_luz"
                name="incluye_luz"
                value={formData.incluye_luz}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona...</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="incluye_agua">Incluye agua:</label>
              <select
                id="incluye_agua"
                name="incluye_agua"
                value={formData.incluye_agua}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona...</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="incluye_todos_los_servicios">Incluye todos los servicios:</label>
              <select
                id="incluye_todos_los_servicios"
                name="incluye_todos_los_servicios"
                value={formData.incluye_todos_los_servicios}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona...</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <button type="submit" className="signup-button">
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Departamento;
