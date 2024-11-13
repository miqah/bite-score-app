import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loading from "../../components/Loading/Loading";
import { useAuthRedirect } from "../../hooks/useAuth";

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
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    image: "",
  });
  const [error, setError] = useState("");

  useAuthRedirect();

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    const route = process.env.API_ROUTE;

    try {
      const response = await fetch(`${route}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newRecipe.title,
          ingredients: newRecipe.ingredients.split("\n"),
          instructions: newRecipe.instructions,
          image: newRecipe.image,
        }),
      });

      if (!response.ok) throw new Error("Failed to add recipe");

      setShowAddRecipeForm(false); // Hide the form after successful submission
      setNewRecipe({ title: "", ingredients: "", instructions: "", image: "" }); // Reset form state
    } catch (err) {
      setError("Error adding recipe");
    }
  };

  const handleCopyRecipe = () => {
    if (recipe) {
      setNewRecipe({
        title: recipe.strMeal,
        ingredients: Object.keys(recipe)
          .filter((key) => key.startsWith("strIngredient"))
          .map((key) => recipe[key as keyof RecipeProps])
          .join("\n"),
        instructions: recipe.strInstructions,
        image: recipe.strMealThumb,
      });
    }
  };

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

        {/* Add Recipe Button */}
        <button
          onClick={() => setShowAddRecipeForm(!showAddRecipeForm)}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#81D182",
            color: "#2B463C",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.3s ease",
          }}
        >
          {showAddRecipeForm ? "Cancel" : "Add Recipe"}
        </button>

        {/* Add Recipe Form */}
        {showAddRecipeForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: "600px", //
              marginTop: "50px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "20px",
              boxSizing: "border-box",
              marginRight: "20px",
            }}
          >
            {error && (
              <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
            )}

            {/* Title Input */}
            <div>
              <label
                style={{
                  fontWeight: "bold",
                  color: "#2B463C",
                  marginRight: "8px",
                }}
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newRecipe.title}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>

            {/* Ingredients Textarea */}
            <div>
              <label style={{ fontWeight: "bold", color: "#2B463C" }}>
                Ingredients (Separate each ingredient by a new line)
              </label>
              <textarea
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  height: "120px",
                }}
              />
            </div>

            {/* Instructions Textarea */}
            <div>
              <label style={{ fontWeight: "bold", color: "#2B463C" }}>
                Instructions
              </label>
              <textarea
                name="instructions"
                value={newRecipe.instructions}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  height: "150px",
                }}
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label style={{ fontWeight: "bold", color: "#2B463C" }}>
                Image URL (Optional)
              </label>
              <input
                type="text"
                name="image"
                value={newRecipe.image}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                  fontSize: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              <small style={{ fontSize: "0.9rem", color: "#888" }}>
                Provide an image URL if you'd like to add one.
              </small>
            </div>

            {/* Copy Recipe Button */}
            <div>
              <button
                type="button"
                onClick={handleCopyRecipe}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#81D182",
                  color: "#2B463C",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#688F4E")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#81D182")
                }
              >
                Copy Recipe to Form
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                padding: "12px 20px",
                backgroundColor: "#688F4E",
                color: "#F4F1E9",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#81D182")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#688F4E")
              }
            >
              Submit Recipe
            </button>
          </form>
        )}

        {/* Recipe Content */}
        <div
          style={{
            display: "flex",
            width: "75%",
            maxHeight: "80vh",
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
              overflowY: "auto",
            }}
          >
            <h2 style={{ color: "#81D182" }}>{recipe.strMeal}</h2>

            <h3>Ingredients</h3>
            <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
              {Object.keys(recipe)
                .filter((key) => key.startsWith("strIngredient"))
                .map((key, index) => {
                  const ingredient = recipe[key as keyof RecipeProps];
                  return ingredient ? (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {ingredient}
                    </li>
                  ) : null;
                })}
            </ul>

            <h3>Instructions</h3>
            <p>{recipe.strInstructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
