import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTimes } from "@fortawesome/free-solid-svg-icons";

interface ChatroomSettingsMenuProps {
  alignRight?: boolean;
  children: React.ReactNode;
}

const DropdownContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.span`
  padding: 0.5em;
  color: var(--white);
  cursor: pointer;
  font-size: var(--font-size-h4);
`;

const DropdownContent = styled.div<{ alignRight?: boolean }>`
  position: absolute;
  top: calc(100% + 1em);
  ${({ alignRight }) => (alignRight ? "right: 0;" : "left: 0;")}
  background: var(--dark);
  border: 1px solid var(--secondary);
  box-shadow: var(--shadow);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: fit-content;
  border-radius: 1em;
  overflow: hidden;
  font-size: var(--font-size-default);

  button {
    background: var(--secondary);
    color: var(--danger-300) !important;
  }
`;

const ChatroomSettingsMenu: React.FC<ChatroomSettingsMenuProps> = ({
  alignRight,
  children,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <DropdownContainer ref={dropdownRef}>
      <MenuButton className="hollow secondary menu-toggle" onClick={toggleMenu}>
        {menuVisible ? (
          <FontAwesomeIcon icon={faTimes} />
        ) : (
          <FontAwesomeIcon icon={faEllipsisVertical} />
        )}
      </MenuButton>
      {menuVisible && (
        <DropdownContent alignRight={alignRight}>{children}</DropdownContent>
      )}
    </DropdownContainer>
  );
};

export default ChatroomSettingsMenu;
