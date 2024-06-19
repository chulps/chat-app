import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import "../images/logo.gif";
import "../css/header.css";
import logo from "../images/logo.gif";
import RotatingText from "./RotatingText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faBars,
  faTimes,
  faHome,
  faRightToBracket,
  faUserPlus,
  faUser,
  faGear,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import ToggleSwitch from "./ToggleSwitch";

const Header: React.FC = () => {
  const [theme, setTheme] = useState("dark");
  const [menuVisible, setMenuVisible] = useState(false);
  const { content } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleMenu = () => {
    setMenuVisible((prevMenuVisible) => !prevMenuVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderLink = (path: string, icon: any, label: string) => {
    return location.pathname !== path ? (
      <Link to={path} onClick={() => setMenuVisible(false)}>
        <FontAwesomeIcon icon={icon} />
          {label}
      </Link>
    ) : null;
  };

  return (
    <header>
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuVisible ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>
        {menuVisible && (
          <div className="dropdown-menu" ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                {renderLink("/dashboard", faGauge, "Dashboard")}
                {renderLink("/profile", faUser, "Profile")}
                {renderLink("/settings", faGear, "Settings")}
                <button
                  onClick={() => {
                    logout();
                    setMenuVisible(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {renderLink("/", faHome, "Home")}
                {renderLink("/login", faRightToBracket, "Login")}
                {renderLink("/register", faUserPlus, "Register")}
              </>
            )}
            <hr />
            <div className="menu-theme-toggle">
              Theme ({theme === "dark" ? "Dark" : "Light"})
              <ToggleSwitch
                isOn={theme === "dark"}
                handleToggle={toggleTheme}
                onIcon={<FontAwesomeIcon icon={faSun} />}
                offIcon={<FontAwesomeIcon icon={faMoon} />}
                targetLanguage={content.language}
              />
            </div>
          </div>
        )}
        <Link to="/" className="logo-container" onClick={() => setMenuVisible(false)}>
          <RotatingText fill="var(--secondary)" />
          <img className="logo" src={logo} alt="Chuck Howard" />
        </Link>
      </div>
      <div className="header-right">
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;
