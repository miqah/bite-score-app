import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import happyCustomerImg from "../../assets/happy-customer.png";
import logo from "../../assets/icons/logo.png";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const route = process.env.API_ROUTE;

    try {
      const response = await fetch(`${route}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage on successful sign-up
        localStorage.setItem("authToken", data.token);
        // Redirect to the profile page or home page after sign-up
        navigate("/profile");
      } else {
        setError(data.message || "Sign-up failed");
      }
    } catch (err) {
      setError("An error occurred while signing up.");
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="top-container">
        <div className="top-left-container">
          <img
            src={happyCustomerImg}
            alt="Happy Customer"
            height="100%"
            width="100%"
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="top-right-container">
          <form onSubmit={handleSubmit} className="form-container">
            <h2>Bite-Score Sign Up</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Sign Up</button>
            {/* Login Link */}
            <div>
              <div className="login-text">
                <p>
                  Already have an account? <a href="/login">Login</a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-container">
        <div className="footer">
          <img src={logo} alt="logo" className="footer-logo" />
          <div className="footer-card">
            <p>
              Bite Score is your go-to recipe website, featuring a wide variety
              of delicious dishes and an easy-to-use search function. Join our
              community and let’s cook up something amazing together!
            </p>
          </div>
        </div>

        <div className="newsletter-container">
          <p>
            Enter your email to get the latest recipes, cooking tips, and
            updates straight to your inbox.
          </p>
          <div className="newsletter-input-container">
            <input type="email" placeholder="Enter your email" />
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
