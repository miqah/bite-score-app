import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { useAuthRedirect } from "../hooks/useAuth";

const Home: React.FC = () => {
  useAuthRedirect()
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
      }}
    >
      <Sidebar />
      <h1>Welcome to the Recipe App</h1>
      <p>Find delicious recipes to try!</p>
    </div>
  );
};

export default Home;