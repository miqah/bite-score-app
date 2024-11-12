import React, { useState } from "react";
import "./Sidebar.css";
import NavbarLink from "../NavbarLink/NavbarLink";
import LeftArrowIcon from "../../assets/icons/arrow-left.svg";
import RightArrowIcon from "../../assets/icons/arrow-right.svg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <>
          <button className="profile-button">P</button>
          <NavbarLink location="/recipes">Our Recipies</NavbarLink>
          <NavbarLink location="/mypage">My Recipes</NavbarLink>
        </>
      )}
      <button onClick={toggleSidebar} className="sidebar-toggle-button">
        <img
          src={isOpen ? LeftArrowIcon : RightArrowIcon}
          alt="Toggle Sidebar"
          className="sidebar-toggle-icon"
        />
      </button>
    </div>
  );
};

export default Sidebar;
