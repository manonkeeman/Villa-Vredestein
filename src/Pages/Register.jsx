import { useEffect } from "react";
import axios from "axios";

async function fetchRecipes(query) {
  try {
    const appId = "6497d4b5";
    const appKey = "030438b0ae6eccd53c24c5040dc23cfc";
    const userId = "manonkeeman";

    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${appKey}`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Edamam-Account-User": userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Data opgehaald:", response.data);
    return response.data;
  } catch (e) {
    console.error("Fout bij het ophalen van recepten:", e);
  }
}

function Register() {
  useEffect(() => {
    fetchRecipes("pasta");
  }, []);

  return (
      <div>
        <h1>Registreer hier</h1>
      </div>
  );
}

export default Register;