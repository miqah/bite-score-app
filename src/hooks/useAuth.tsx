import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for the authToken
    const authToken = localStorage.getItem("authToken");
    console.log("Auth Token:", authToken); // Debug log to check the value

    // If no authToken is found, navigate to the login page
    if (!authToken) {
      console.log("No auth token found, redirecting to login...");
      navigate("/login");
    }
  }, [navigate]); // The effect will run when the component mounts
};