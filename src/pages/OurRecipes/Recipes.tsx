import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loading from "../../components/Loading/Loading";
import "./Recipes.css";

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
    </div>
  );
};

export default RecipeList;
