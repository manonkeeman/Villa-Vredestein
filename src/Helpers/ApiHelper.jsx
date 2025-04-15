import axios from "axios";

/* Bouwt de query parameters voor de Edamam API. */
export const buildEdamamParams = ({ zoekwoord, maaltijden, dieet, keukens }) => {
    const params = {
        q: zoekwoord || "recipe",
        type: "public",
        app_id: import.meta.env.VITE_APP_ID,
        app_key: import.meta.env.VITE_APP_KEY,
    };

    if (maaltijden?.length > 0) params.mealType = maaltijden.join(",");
    if (dieet?.length > 0) params.health = dieet.join(",");
    if (keukens?.length > 0) params.cuisineType = keukens.join(",");

    return params;
};

/* Roept de Edamam API aan met gegeven parameters. */
export const fetchRecipes = async (zoekwoord, maaltijden, dieet, keukens) => {
    const params = {
        q: zoekwoord || "recipe",
        type: "public",
        app_id: import.meta.env.VITE_APP_ID,
        app_key: import.meta.env.VITE_APP_KEY,
    };

    if (maaltijden.length > 0) params.mealType = maaltijden.join(",");
    if (dieet.length > 0) params.health = dieet.join(",");
    if (keukens.length > 0) params.cuisineType = keukens.join(",");

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

/* Zet een array van ingredient-objecten om naar een string. */
export const buildIngredientsList = (ingredients) =>
    ingredients.map(i => i.food).join(", ");