import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.datavortex.nl/villavredesteinlogin",
    headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "villavredesteinlogin:2NkpAp3ZiXKfSlM4fwxW",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;