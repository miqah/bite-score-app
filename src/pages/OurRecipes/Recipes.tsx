import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal"; // Import the Modal component
import "./Recipes.css";
import { useAuthRedirect } from "../../hooks/useAuth";

interface RecipeProps {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
}

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false); // Modal visibility state
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
  });

  useAuthRedirect();

  useEffect(() => {
    // Fetch categories
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(
            data.categories.map((category: any) => category.strCategory)
          );
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch recipes
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          setRecipes(data.meals);
          setFilteredRecipes(data.meals);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterRecipes(query, selectedCategory);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterRecipes(searchQuery, category);
  };

  const filterRecipes = (query: string, category: string) => {
    const filtered = recipes.filter((recipe) => {
      const matchesSearch = recipe.strMeal.toLowerCase().includes(query);
      const matchesCategory = category ? recipe.strCategory === category : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredRecipes(filtered);
  };

  const openModal = () => {
    setShowAddRecipeModal(true); // Show modal when clicking the button
  };

  const closeModal = () => {
    setShowAddRecipeModal(false); // Close modal
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authorization token found.");
      return;
    }

    const recipeData = {
      title: newRecipe.title,
      ingredients: newRecipe.ingredients,
      instructions: newRecipe.instructions,
    };

    const route = process.env.API_ROUTE;

    fetch(`${route}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipeData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Recipe added successfully:", data);
        closeModal();
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
        }); // Reset form
      })
      .catch((error) => {
        console.error("Error adding recipe:", error);
        // Optionally handle error
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="recipe-list-container">
      <Sidebar />
      <div className="recipe-list-content">
        <h1 className="title">Our Recipes</h1>

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for a recipe"
          className="search-bar"
        />

        {/* Add Recipe Button */}
        <button
          onClick={openModal}
          className="add-recipe-btn"
          style={{
            marginLeft: "8px",
          }}
        >
          Add Recipe
        </button>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="select-dropdown"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {filteredRecipes.length === 0 ? (
          <div className="no-recipes-message">No recipes added yet</div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.idMeal} className="recipe-item">
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="recipe-image"
                />
                <h3 className="recipe-title">{recipe.strMeal}</h3>
                <button className="view-recipe-button">
                  <a
                    href={`/recipes/${recipe.idMeal}`}
                    className="view-recipe-link"
                  >
                    View Recipe
                  </a>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding a recipe */}
      {showAddRecipeModal && (
        <Modal onClose={closeModal} isOpen={showAddRecipeModal}>
          <div className="add-recipe-form">
            <h2 className="modal-title">Add a New Recipe</h2>
            <form onSubmit={handleFormSubmit} className="recipe-form">
              <div className="form-group">
                <label htmlFor="recipeTitle" className="form-label">
                  Recipe Title
                </label>
                <input
                  type="text"
                  id="recipeTitle"
                  name="title"
                  value={newRecipe.title}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipeIngredients" className="form-label">
                  Ingredients
                </label>
                <textarea
                  id="recipeIngredients"
                  name="ingredients"
                  value={newRecipe.ingredients}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipeInstructions" className="form-label">
                  Instructions
                </label>
                <textarea
                  id="recipeInstructions"
                  name="instructions"
                  value={newRecipe.instructions}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <button type="submit" className="submit-recipe-btn">
                  Submit Recipe
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RecipeList;
