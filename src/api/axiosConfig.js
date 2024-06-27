import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Ajusta esta URL según tu configuración
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
