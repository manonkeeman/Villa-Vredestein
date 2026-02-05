import axios from "./AxiosHelper.js";

/**
 * ============================
 *  AUTH
 * ============================
 */

export const login = async (email, password) => {
    try {
        const response = await axios.post("/api/auth/login", {
            email,
            password,
        });

        const { token } = response.data;

        if (!token) {
            throw new Error("Geen token ontvangen van de server.");
        }

        localStorage.setItem("accessToken", token);
        return token;
    } catch (error) {
        throw formatApiError(error, "Inloggen mislukt");
    }
};

export const logout = () => {
    localStorage.removeItem("accessToken");
};

/**
 * ============================
 *  USER / PROFILE
 * ============================
 */

export const fetchCurrentUser = async () => {
    try {
        const response = await axios.get("/api/users/me");
        return response.data;
    } catch (error) {
        throw formatApiError(error, "Gebruiker ophalen mislukt");
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await axios.put("/api/users/me/profile", profileData);
        return response.data;
    } catch (error) {
        throw formatApiError(error, "Profiel bijwerken mislukt");
    }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        await axios.patch("/api/users/me/password", {
            oldPassword,
            newPassword,
        });
        return true;
    } catch (error) {
        throw formatApiError(error, "Wachtwoord wijzigen mislukt");
    }
};

/**
 * ============================
 *  ADMIN (voorbeeld)
 * ============================
 */

export const fetchAllUsers = async () => {
    try {
        const response = await axios.get("/api/users");
        return response.data;
    } catch (error) {
        throw formatApiError(error, "Gebruikers ophalen mislukt");
    }
};

/**
 * ============================
 *  GENERIC PROTECTED FETCH
 * ============================
 */

export const fetchProtectedData = async (endpoint) => {
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        throw formatApiError(error, "Beveiligde data ophalen mislukt");
    }
};

/**
 * ============================
 *  ERROR HANDLING
 * ============================
 */

const formatApiError = (error, fallbackMessage) => {
    const status = error.response?.status;
    const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        fallbackMessage;

    return new Error(
        status ? `Error ${status}: ${message}` : message
    );
};