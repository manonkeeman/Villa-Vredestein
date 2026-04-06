import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import axios, { TOKEN_STORAGE_KEY } from "../../Helpers/AxiosHelper.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = TOKEN_STORAGE_KEY; // "accessToken"
const USER_KEY = "user";
const LOGIN_MODE_KEY = "loginMode";
const ROOM_KEY = "room";

const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080"
).replace(/\/$/, "");

const safeJsonParse = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
};

const normalizeRoles = (raw) => {
    if (!raw) return [];

    const list = Array.isArray(raw) ? raw : [raw];

    const extract = (v) => {
        if (!v) return "";
        if (typeof v === "string") return v;
        if (typeof v === "object") {
            if (typeof v.authority === "string") return v.authority;
            if (typeof v.name === "string") return v.name;
            if (typeof v.role === "string") return v.role;
            if (Array.isArray(v.authorities)) return v.authorities.map(extract).filter(Boolean).join(",");
        }
        return "";
    };

    return list
        .flatMap((x) => (x && typeof x === "object" && Array.isArray(x.authorities) ? x.authorities : [x]))
        .map(extract)
        .flatMap((s) => String(s).split(","))
        .map((s) => s.trim())
        .filter(Boolean)
        .map((r) => (r.toUpperCase().startsWith("ROLE_") ? r.toUpperCase() : `ROLE_${r.toUpperCase()}`));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.defaults.baseURL = API_BASE;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(LOGIN_MODE_KEY);
        localStorage.removeItem(ROOM_KEY);
        delete axios.defaults.headers.common.Authorization;
        setUser(null);
        setLoading(false); // prevents “white page keeps loading”
    }, []);

    useEffect(() => {
        const handler = () => logout();
        window.addEventListener("auth:logout", handler);
        return () => window.removeEventListener("auth:logout", handler);
    }, [logout]);

    const loadMe = useCallback(async () => {
        try {
            const res = await axios.get("/api/users/me");
            const me = res.data;

            const roles = normalizeRoles(me?.roles ?? me?.authorities ?? me?.role);

            const normalizedUser = { ...me, roles };
            localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
            setUser(normalizedUser);

            return normalizedUser;
        } catch (e) {
            console.error("❌ loadMe failed:", e.response?.data || e.message);
            logout();
            return null;
        }
    }, [logout]);

    const login = useCallback(
        async (email, password, options = {}) => {
            const cleanEmail = String(email).trim().toLowerCase();
            const loginMode = options?.loginMode ? String(options.loginMode).trim().toUpperCase() : "";
            const room = options?.room ? String(options.room).trim() : "";

            try {
                const res = await axios.post("/api/auth/login", {
                    email: cleanEmail,
                    password,
                    loginMode: loginMode || undefined,
                    room: room || undefined,
                });

                const token = res.data?.token ?? res.data?.jwt ?? res.data?.accessToken;
                if (!token) {
                    console.error("❌ Login response did not contain token:", res.data);
                    return false;
                }

                localStorage.setItem(TOKEN_KEY, token);
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;

                if (loginMode) localStorage.setItem(LOGIN_MODE_KEY, loginMode);
                else localStorage.removeItem(LOGIN_MODE_KEY);

                if (room) localStorage.setItem(ROOM_KEY, room);
                else localStorage.removeItem(ROOM_KEY);

                const me = await loadMe();

                if (!me) {
                    const decoded = decodeToken(token);
                    const roles = normalizeRoles(decoded?.roles ?? decoded?.authorities ?? decoded?.role);
                    const fallbackUser = { email: cleanEmail, sub: decoded?.sub, roles, tokenDecoded: decoded };
                    localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
                    setUser(fallbackUser);
                }

                return true;
            } catch (error) {
                console.error("❌ Login error:", error.response?.data || error.message);
                return false;
            }
        },
        [loadMe]
    );

    const register = useCallback(async (data) => {
        try {
            const cleanData = {
                ...data,
                email: String(data.email ?? "").trim().toLowerCase(),
                username: String(data.username ?? data.email ?? "").trim().toLowerCase(),
            };

            const res = await axios.post("/api/auth/register", cleanData);
            return res.status === 201 || res.status === 200;
        } catch (error) {
            console.error("❌ Register error:", error.response?.data || error.message);
            return false;
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        const storedUser = safeJsonParse(localStorage.getItem(USER_KEY));

        const bootstrap = async () => {
            try {
                if (!token) {
                    setUser(null);
                    return;
                }

                if (isTokenExpired(token)) {
                    logout();
                    return;
                }

                axios.defaults.headers.common.Authorization = `Bearer ${token}`;

                if (storedUser) setUser(storedUser);

                await loadMe();
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, [loadMe, logout]);

    const token = localStorage.getItem(TOKEN_KEY);
    const isLoggedIn = Boolean(user) && Boolean(token) && !isTokenExpired(token);

    const value = useMemo(
        () => ({
            isLoggedIn,
            user,
            login,
            logout,
            register,
            loading,
            reloadUser: loadMe,
            getStoredLoginMode: () => localStorage.getItem(LOGIN_MODE_KEY),
            getStoredRoom: () => localStorage.getItem(ROOM_KEY),
        }),
        [isLoggedIn, user, login, logout, register, loading, loadMe]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};