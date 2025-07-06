import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5091',
    // Puedes cambiar la URL base según tu entorno de desarrollo o producción
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
            config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;