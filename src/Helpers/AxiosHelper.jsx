import axios from "axios";

// Maak een instance met basisconfiguratie
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true, // voor cookies zoals refreshToken
    headers: {
        "Content-Type": "application/json",
    },
});

// Voeg Authorization header toe aan elke request als er een token is
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;