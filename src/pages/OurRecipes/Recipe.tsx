import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loading from "../../components/Loading/Loading";

interface RecipeProps {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  [key: `strIngredient${number}`]: string | undefined;
}

const Recipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeProps | null>(null);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [id]);

  if (!recipe) return <Loading />;

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F4F1E9",
        height: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "#688F4E",
            color: "#F4F1E9",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.3s ease", // Transition for smooth effect
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#81D182"; // Lighter color on hover
            e.currentTarget.style.transform = "scale(1.2)"; // Larger scale on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#688F4E"; // Revert color
            e.currentTarget.style.transform = "scale(1)"; // Return to original size
          }}
        >
          Back
        </button>

        {/* Recipe Content */}
        <div
          style={{
            display: "flex",
            width: "75%",
            maxHeight: "80vh", // This will create the overflow when content exceeds this height
            backgroundColor: "#2B463C",
            color: "#F4F1E9",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          {/* Recipe Image */}
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            style={{
              width: "50%",
              objectFit: "cover",
            }}
          />

          {/* Recipe Info */}
          <div
            style={{
              padding: "20px",
              width: "50%",
              overflowY: "auto", // Enable vertical scrolling if content overflows
            }}
          >
            <h2 style={{ color: "#81D182" }}>{recipe.strMeal}</h2>

            <h3>Ingredients</h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
              {Object.keys(recipe)
                .filter(
                  (key) =>
                    key.startsWith("strIngredient") &&
                    recipe[key as keyof RecipeProps]
                )
                .map((key, index) => (
                  <li key={index} style={{ color: "#F4F1E9" }}>
                    {recipe[key as keyof RecipeProps]}
                  </li>
                ))}
            </ul>

            <h3>Instructions</h3>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              <p>{recipe.strInstructions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
