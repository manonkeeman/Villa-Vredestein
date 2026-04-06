import axios from "axios";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const baseURL = (RAW_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export const TOKEN_STORAGE_KEY = "accessToken";

const instance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        config.headers = config.headers ?? {};

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem("user");
            localStorage.removeItem("loginMode");
            localStorage.removeItem("room");

            window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(error);
    }
);

export default instance;