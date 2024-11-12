import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarLink.css";

interface NavbarLinkProps {
  location: string;
  children: React.ReactNode;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ location, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(location);

  return (
    <Link to={location} className={`navbar-link ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
};

export default NavbarLink;
