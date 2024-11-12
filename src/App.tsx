import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/OurRecipes/Recipes";
import Recipe from "./pages/OurRecipes/Recipe";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ background: "#" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
