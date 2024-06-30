// src/components/Filters.js
import React from 'react';

const Filters = ({ filters, setFilters }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="filters-container">
      <h3>Filtrar por:</h3>
      <div>
        <input
          type="checkbox"
          name="todos_los_servicios_basicos"
          checked={filters.todos_los_servicios_basicos}
          onChange={handleCheckboxChange}
        />
        <label>Todos los Servicios Basicos</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="incluye_luz"
          checked={filters.incluye_luz}
          onChange={handleCheckboxChange}
        />
        <label>Incluye Luz</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="incluye_agua"
          checked={filters.incluye_agua}
          onChange={handleCheckboxChange}
        />
        <label>Incluye Agua</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="incluye_telefono"
          checked={filters.incluye_telefono}
          onChange={handleCheckboxChange}
        />
        <label>Incluye Teléfono</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="incluye_internet"
          checked={filters.incluye_internet}
          onChange={handleCheckboxChange}
        />
        <label>Incluye Internet</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="incluye_garaje"
          checked={filters.incluye_garaje}
          onChange={handleCheckboxChange}
        />
        <label>Incluye Garaje</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="aceptan_gatos"
          checked={filters.aceptan_gatos}
          onChange={handleCheckboxChange}
        />
        <label>Aceptan Gatos</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="aceptan_perros"
          checked={filters.aceptan_perros}
          onChange={handleCheckboxChange}
        />
        <label>Aceptan Perros</label>
      </div>
      <div>
        <input
          type="checkbox"
          name="lavanderia"
          checked={filters.lavanderia}
          onChange={handleCheckboxChange}
        />
        <label>Lavandería</label>
      </div>
      <div>
        <label>Precio mínimo:</label>
        <input
          type="number"
          name="precioMin"
          value={filters.precioMin}
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <label>Precio máximo:</label>
        <input
          type="number"
          name="precioMax"
          value={filters.precioMax}
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <label>Tamaño mínimo:</label>
        <input
          type="number"
          name="tamanoMin"
          value={filters.tamanoMin}
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <label>Tamaño máximo:</label>
        <input
          type="number"
          name="tamanoMax"
          value={filters.tamanoMax}
          onChange={handlePriceChange}
        />
      </div>
    </div>
  );
};

export default Filters;
