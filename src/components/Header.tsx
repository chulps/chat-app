import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
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
  faRightFromBracket,
  faUserPlus,
  faUser,
  faGear,
  faGauge,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import ToggleSwitch from "./ToggleSwitch";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 var(--space-1) 0;

  @media screen and (min-width: 576px) {
    padding: var(--space-1) 0;
  }
`;

const Logo = styled.img`
  aspect-ratio: 1/1;
  height: calc(var(--space-3) + var(--space-2));
  margin-left: -2px;
  margin-top: -1px;
`;

const LogoContainer = styled(Link)`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: fit-content;

  &:hover {
    transform: scale(1.05);
    transform-origin: center;
  }
`;

const MenuButton = styled.button`
  padding: 1em;
  min-width: calc(var(--space-3) + var(--space-2));
  background: none;
  color: var(--white);
  cursor: pointer;
  outline: 1px solid var(--secondary);
`;

const HeaderSection = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--dark);
  border: 1px solid var(--secondary);
  box-shadow: var(--shadow);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: var(--space-6);
  border-radius: 1em;
  overflow: hidden;

  a {
    padding: 1em;
    text-align: left;
    color: var(--text);
    text-decoration: none;
    border-bottom: 1px solid var(--border);

    &:hover {
      background: var(--dark);
    }
  }

  button {
    background: var(--secondary);
    color: var(--danger-300) !important;

    &:hover {
      filter: brightness(1.3);
    }
  }
`;

const MenuThemeToggle = styled.div`
  display: flex;
  padding: 1em;
  align-items: center;
  justify-content: space-between;
`;

const LogoutButton = styled.div`
  width: 100%;
  border-radius: 0;
  border-top: 1px solid var(--secondary);
  text-align: left;
  justify-content: flex-start;
  padding-inline: var(--space-2);
  color: var(--danger-300);
  padding-block: var(--space-2);

  &:hover {
    background: var(--dark);
    cursor: pointer;
    filter: brightness(1.3);
  }
`;

const Header: React.FC = () => {
  const [theme, setTheme] = useState("dark");
  const [menuVisible, setMenuVisible] = useState(false);
  const { content } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();
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

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMenuVisible((prevMenuVisible) => !prevMenuVisible);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setMenuVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const renderLink = (path: string, icon: any, label: string) => {
    return location.pathname !== path ? (
      <Link to={path} onClick={() => setMenuVisible(false)}>
        <FontAwesomeIcon icon={icon} />
          {label}
      </Link>
    ) : null;
  };

  return (
    <HeaderContainer>
      <HeaderSection>
        <MenuButton className="hollow secondary menu-toggle" onClick={toggleMenu}>
          {menuVisible ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </MenuButton>
        {menuVisible && (
          <DropdownMenu ref={dropdownRef}>
            {renderLink("/", faHome, "Home")}
            {isAuthenticated ? (
              <>
                {renderLink("/dashboard", faGauge, "Dashboard")}
                {renderLink("/profile/me", faUser, "Profile")}
                {renderLink("/settings", faGear, "Settings")}
              </>
            ) : (
              <>
                {renderLink("/login", faRightToBracket, "Login")}
                {renderLink("/register", faUserPlus, "Register")}
              </>
            )}
            <hr />
            <MenuThemeToggle>
              Theme ({theme === "dark" ? "Dark" : "Light"})
              <ToggleSwitch
                id="theme-toggle"
                isOn={theme === "light"}
                handleToggle={toggleTheme}
                onIcon={<FontAwesomeIcon icon={faSun} />}
                offIcon={<FontAwesomeIcon icon={faMoon} />}
                targetLanguage={content.language}
                onIconColor="var(--warning-500)"
                offIconColor="var(--royal-400)"
                onBackgroundColor="var(--royal-300)"
                offBackgroundColor="var(--site-background)"
              />
            </MenuThemeToggle>
            {isAuthenticated && (
              <LogoutButton onClick={logout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </LogoutButton>
            )}
          </DropdownMenu>
        )}
        <LogoContainer to="/">
          <RotatingText fill="var(--secondary)" />
          <Logo src={logo} alt="Chuck Howard" />
        </LogoContainer>
      </HeaderSection>
      <HeaderSection>
        <LanguageSelector />
      </HeaderSection>
    </HeaderContainer>
  );
};

export default Header;
