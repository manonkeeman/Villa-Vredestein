import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "X-Api-Key": import.meta.env.VITE_API_KEY,
    },
    withCredentials: false,
});

export default axiosInstance;

