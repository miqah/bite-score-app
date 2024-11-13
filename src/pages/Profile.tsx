import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { useAuthRedirect } from "../hooks/useAuth";

// The Profile component to show user profile
const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if user is not authenticated
  useAuthRedirect();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }
      
      const route = process.env.API_ROUTE

      try {
        const response = await fetch(`${route}/api/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set the user profile data
        } else {
          setError("Failed to fetch profile");
        }
      } catch (error) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", minWidth: "100vw" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "20px", padding: "20px", backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "2rem", color: "#333", textAlign: "center", marginBottom: "20px" }}>Your Profile</h2>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ backgroundColor: "#f9fafb", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.5rem", color: "#2c3e50", marginBottom: "10px" }}>{user?.name}</h3>
            <p style={{ fontSize: "1.1rem", color: "#7f8c8d" }}>Username: <strong>{user?.username}</strong></p>
            <p style={{ fontSize: "1.1rem", color: "#7f8c8d" }}>Email: <strong>{user?.email}</strong></p>
            {/* Don't display password in plain text */}
            <p style={{ fontSize: "1.1rem", color: "#7f8c8d" }}>Password: <strong>******</strong> (hidden for security)</p>
          </div>

          {/* Additional user information if any */}
          <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h4 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "15px" }}>Additional Information</h4>
           
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;