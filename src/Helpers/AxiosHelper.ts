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
    timeout: 45000, // 45s — genoeg voor Render cold start; voorkomt eindeloos hangen
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

// Decode JWT expiry without an import — avoids circular deps
const getTokenExp = (token) => {
    try { return JSON.parse(atob(token.split(".")[1])).exp; }
    catch { return null; }
};

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            const exp   = getTokenExp(token);
            const isExpiredOrMissing = !token || !exp || exp * 1000 < Date.now();

            // Only force-logout when the token is truly gone or expired.
            // A 401 on an admin endpoint with a valid token = permission error,
            // not a session failure — don't kick the user out.
            if (isExpiredOrMissing) {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem("user");
                localStorage.removeItem("loginMode");
                localStorage.removeItem("room");
                window.dispatchEvent(new Event("auth:logout"));
            }
        }

        return Promise.reject(error);
    }
);

export default instance;