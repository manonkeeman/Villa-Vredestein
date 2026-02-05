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
import axios from "../../Helpers/AxiosHelper.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

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
    } catch (e) {
        console.error("❌ Token decoding failed:", e);
        return null;
    }
};

const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
};

const normalizeRoles = (raw) => {
    if (!raw) return [];

    const list = Array.isArray(raw) ? raw : [raw];

    return list
        .flatMap((x) => {
            if (!x) return [];
            if (typeof x === "string") return [x];
            if (typeof x === "object" && Array.isArray(x.authorities)) return x.authorities;
            return [];
        })
        .map((r) => (typeof r === "string" ? r.trim() : ""))
        .filter(Boolean)
        .map((r) => (r.startsWith("ROLE_") ? r : `ROLE_${r}`))
        .map((r) => r.toUpperCase());
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = Boolean(user);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    }, []);

    const loadMe = useCallback(async () => {
        const res = await axios.get("/api/users/me");
        const me = res.data;

        const roles = normalizeRoles(me?.roles ?? me?.authorities ?? me?.role);

        const normalizedUser = {
            ...me,
            roles,
        };

        localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
        setUser(normalizedUser);

        return normalizedUser;
    }, []);

    const login = useCallback(
        async (email, password) => {
            const cleanEmail = String(email).trim().toLowerCase();

            try {
                const res = await axios.post("/api/auth/login", {
                    email: cleanEmail,
                    password,
                });

                const token = res.data?.token ?? res.data?.jwt ?? res.data?.accessToken;
                if (!token) {
                    console.error("❌ Login response did not contain a token:", res.data);
                    return false;
                }

                localStorage.setItem(TOKEN_KEY, token);

                try {
                    await loadMe();
                } catch {
                    // Fallback: derive minimal identity from JWT
                    const decoded = decodeToken(token);
                    const roles = normalizeRoles(decoded?.roles ?? decoded?.authorities ?? decoded?.role);

                    const fallbackUser = {
                        email: cleanEmail,
                        sub: decoded?.sub,
                        roles,
                        tokenDecoded: decoded,
                    };

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

                if (storedUser) {
                    setUser(storedUser);
                }

                await loadMe();
            } catch {
                if (!storedUser) logout();
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, [loadMe, logout]);

    const value = useMemo(
        () => ({
            isLoggedIn,
            user,
            login,
            logout,
            register,
            loading,
            reloadUser: loadMe,
        }),
        [isLoggedIn, user, login, logout, register, loading, loadMe]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};