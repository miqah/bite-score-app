import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
}

const Recipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // Fetch a single recipe based on the id
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data));
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h2>{recipe.title}</h2>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default Recipe;
