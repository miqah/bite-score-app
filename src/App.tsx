import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/OurRecipes/Recipes";
import Recipe from "./pages/OurRecipes/Recipe";
import Profile from "./pages/Profile";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import MyRecipes from "./pages/MyRecipes/MyRecipes";

const App: React.FC = () => {
  return (
    // Add basename to BrowserRouter for routing in a subdirectory
    <Router basename="/bite-score-app">
      {" "}
      {/* Replace "bite-score-app" with your repo name */}
      <div style={{ background: "#" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myrecipes" element={<MyRecipes />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
