import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Sidebar.css";
import NavbarLink from "../NavbarLink/NavbarLink";
import LeftArrowIcon from "../../assets/icons/arrow-left.svg";
import RightArrowIcon from "../../assets/icons/arrow-right.svg"; 
import LeaveIcon from "../../assets/icons/leave-icon.svg"; 
import Logo from "../../assets/icons/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate(); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <>
          {/* Logo Image Above Profile Button */}
          <div className="logo-container">
            <img src={Logo} alt="Logo" className="logo" />
          </div>
        
          <NavbarLink location="/profile">My Profile</NavbarLink>
          <NavbarLink location="/recipes">Our Recipes</NavbarLink>
          <NavbarLink location="/myrecipes">My Recipes</NavbarLink>
        </>
      )}

      <button onClick={toggleSidebar} className="sidebar-toggle-button">
        <img
          src={isOpen ? LeftArrowIcon : RightArrowIcon}
          alt="Toggle Sidebar"
          className="sidebar-toggle-icon"
        />
      </button>

      {/* Log Out Button at the bottom */}
      <button onClick={handleLogout} className="logout-button">
        {isOpen ? (
          "Log Out" // Text when sidebar is open
        ) : (
          <img src={LeaveIcon} alt="Leave Icon" /> // Icon when sidebar is closed
        )}
      </button>
    </div>
  );
};

export default Sidebar;