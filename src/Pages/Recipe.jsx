import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function Recipe() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {


      try {
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=pasta&app_id=${import.meta.env.VITE_APP_ID}&app_key=${import.meta.env.VITE_APP_KEY}`, {
          headers: {
            Accept: "application/json",
            "Edamam-Account-User": import.meta.env.VITE_APP_ID,
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
        <ul>
          {recipes.map((recipe, index) => (
              <li key={index} >
                <h3>{recipe.recipe.label}</h3>
                <img src={recipe.recipe.image} alt={recipe.recipe.label} />
                <Link to={recipe.recipe.url} target="_blank" rel="noopener noreferrer">Bekijk recept</Link>
              </li>
          ))}
        </ul>
      </div>
  );
}