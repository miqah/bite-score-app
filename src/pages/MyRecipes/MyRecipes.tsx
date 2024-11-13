import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyRecipes.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const MyRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      const route = process.env.API_ROUTE;

      try {
        const response = await fetch(`${route}/api/recipes`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          setError("Failed to fetch recipes.");
        }
      } catch (error) {
        setError("Error fetching recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleCardClick = (recipe: any) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    const route = process.env.API_ROUTE;

    try {
      const response = await fetch(`${route}/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe._id !== recipeId)); // Remove deleted recipe from the state
        handleCloseModal(); // Close modal after deletion
        alert("Recipe deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Error deleting recipe.");
      }
    } catch (error) {
      setError("Error deleting recipe.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="my-recipes-container"
      style={{
        display: "flex",
        backgroundColor: "#F4F1E9",
        height: "100vh",
      }}
    >
      <Sidebar />
      <div
        style={{
          padding: "20px",
        }}
      >
        <h2>Your Recipes</h2>
        <div className="recipe-list">
          {recipes.length === 0 ? (
            <p>You have no recipes yet.</p>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="recipe-card"
                onClick={() => handleCardClick(recipe)}
              >
                <h3>{recipe.title}</h3>
                <p>{recipe.ingredients}</p>
                {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              </div>
            ))
          )}
        </div>

        {showModal && selectedRecipe && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <h3>{selectedRecipe.title}</h3>

              <div className="modal-section">
                <h4>Ingredients</h4>
                <p>{selectedRecipe.ingredients}</p>
              </div>

              <div className="modal-section">
                <h4>Instructions</h4>
                <p>{selectedRecipe.instructions}</p>
              </div>

              {selectedRecipe.image && (
                <div className="modal-image">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="modal-image-img"
                  />
                </div>
              )}

              <button onClick={() => handleDeleteRecipe(selectedRecipe._id)}>
                Delete Recipe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
