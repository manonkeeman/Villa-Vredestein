import axiosInstance from "./AxiosHelper.js";

const buildRecipeSearchParams = ({ zoekwoord = "recipe", maaltijden = [], dieet = [], keukens = [] }) => {
    const app_id = import.meta.env.VITE_APP_ID;
    const app_key = import.meta.env.VITE_APP_KEY;

    if (!app_id || !app_key) {
        throw new Error("API keys niet gevonden. Voeg VITE_APP_ID en VITE_APP_KEY toe aan je .env bestand.");
    }

    const params = {
        q: zoekwoord,
        type: "public",
        app_id,
        app_key,
    };

    if (maaltijden.length > 0) params.mealType = maaltijden.join(",");
    if (dieet.length > 0) params.health = dieet.join(",");
    if (keukens.length > 0) params.cuisineType = keukens.join(",");

    return params;
};

export const fetchRecipes = async (zoekwoord, maaltijden, dieet, keukens) => {
    const params = buildRecipeSearchParams({ zoekwoord, maaltijden, dieet, keukens });

    try {
        const response = await axiosInstance.get("https://api.edamam.com/api/recipes/v2", {
            params,
            headers: {
                "Edamam-Account-User": import.meta.env.VITE_USER_ID,
            },
        });

        return response.data.hits.map(hit => hit.recipe);
    } catch (error) {
        const message =
            error.response?.data?.errors?.map(e => e.error).join(" | ") ||
            error.response?.data?.message ||
            "Onbekende fout";

        throw new Error(`Error ${error.response?.status || ""}: ${message}`);
    }
};

export const buildIngredientsList = (ingredients = []) =>
    ingredients.map(i => i.food).join(", ");

export const fetchProtectedData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("Geen token gevonden.");
    }

    try {
        const response = await axiosInstance.get("/api/protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Fout bij ophalen beveiligde data:", error.message);
        return null;
    }
};