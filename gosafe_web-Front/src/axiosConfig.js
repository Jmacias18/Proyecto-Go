import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api-gosafe.onrender.com/api', // URL base de tu API en producción
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;