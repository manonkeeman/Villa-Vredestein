import axios from "axios";

const buildParams = ({ zoekwoord = "recipe", maaltijden = [], dieet = [], keukens = [] }) => {
    const params = {
        q: zoekwoord,
        type: "public",
        app_id: import.meta.env.VITE_APP_ID,
        app_key: import.meta.env.VITE_APP_KEY,
    };

    if (maaltijden.length > 0) params.mealType = maaltijden.join(",");
    if (dieet.length > 0) params.health = dieet.join(",");
    if (keukens.length > 0) params.cuisineType = keukens.join(",");

    return params;
};

export const fetchRecipes = async (zoekwoord, maaltijden, dieet, keukens) => {
    const params = buildParams({ zoekwoord, maaltijden, dieet, keukens });

    try {
        const response = await axios.get("https://api.edamam.com/api/recipes/v2", {
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
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protected`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Toegang geweigerd");
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Fout bij ophalen beveiligde data:", err.message);
        return null;
    }
};