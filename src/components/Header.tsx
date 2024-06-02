// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import LanguageSelector from './LanguageSelector';
import '../images/logo.gif'
import '../css/header.css';
import logo from "../images/logo.gif";
import RotatingText from "./RotatingText";
import "../css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <header>
      <a
        href="https://chulps.github.io/react-gh-pages/"
        className="logo-container"
      >
        <RotatingText
        fill="var(--secondary)"
        />
        <img className="logo" src={logo} alt="Chuck Howard" />
      </a>
      <div className="header-right">
        <LanguageSelector />
        <button
          onClick={toggleTheme}
          className="theme-toggle tooltip bottom-left"
          data-tooltip={
            theme === "dark"
              ? `Switch to light mode`
              : `Switch to dark mode`
          }
          style={{
            background: theme === "dark" ? "" : "var(--white)",
            color: theme === "dark" ? "" : "var(--royal-200)",
          }}
        >
          {theme === "dark" ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;




