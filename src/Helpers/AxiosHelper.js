import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
    console.error("❌ VITE_API_BASE_URL is not defined. Check Netlify / .env settings.");
}

const instance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false, // JWT via Authorization header, not cookies
});

// ==========================
// Request interceptor
// ==========================
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================
// Response interceptor
// ==========================
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired / invalid → hard logout
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            // Optional: dispatch event so AuthContext can react
            window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(error);
    }
);

export default instance;