import React from "react";
import { Link, useLocation } from "react-router-dom";

const Nav: React.FC = () => {
  const location = useLocation();

  const linkStyle = (path: string) =>
    location.pathname === path
      ? { fontWeight: "bold", textDecoration: "underline" }
      : {};

  return (
    <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
      <Link to="/" style={{ marginRight: "1rem", ...linkStyle("/") }}>
        Home
      </Link>
      <Link to="/tree" style={{ ...linkStyle("/tree") }}>
        SRASM Tree
      </Link>
    </nav>
  );
};

export default Nav;
