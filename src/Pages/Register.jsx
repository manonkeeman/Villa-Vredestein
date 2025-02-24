import { useEffect } from "react";
import axios from "axios";

export default function Register() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      const appId = "6497d4b5";
      const appKey = "030438b0ae6eccd53c24c5040dc23cfc";
      const userId = "manonkeeman";

      try {
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=pasta&app_id=${appId}&app_key=${appKey}`, {
          headers: {
            Accept: "application/json",
            "Edamam-Account-User": userId,
          }
        });
        setRecipes(response.data.hits);
      } catch (error) {
        console.error("Fout bij het ophalen van recepten:", error);
      }
    }

    fetchRecipes();
  }, []);

  return (
      <div>
        <h1>Student Dashboard</h1>
        <h2>Recepten</h2>
        <ul>
          {recipes.map((recipe, index) => (
              <li key={index}>
                <h3>{recipe.recipe.label}</h3>
                <img src={recipe.recipe.image} alt={recipe.recipe.label} />
                <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">Bekijk recept</a>
              </li>
          ))}
        </ul>
      </div>
  );
}