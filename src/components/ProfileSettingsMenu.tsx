// ProfileSettingsMenu.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTimes,
  faUserMinus,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

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

const SettingsMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  gap: var(--space-3);
  background: var(--dark);

    &:hover {
      filter: brightness(1.3);
    }

    &:last-of-type {
      border-bottom: 1px solid var(--secondary);
    }
  }
`;

const MenuItemLeftContent = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: center;
`;

const MenuItemIcon = styled.div`
  display: flex;
  flex-shrink: 1;
  justify-content: center;
  align-items: center;
  width: 1em;
`;

const MenuItemText = styled.div`
  display: flex;
  width: fit-content;
`;

const BlockUser = styled.span`
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  white-space: nowrap;
  gap: var(--space-1);
  color: var(--danger-300);
  cursor: pointer;
  background: var(--dark);

  &:hover {
    filter: brightness(1.3);
  }
`;

interface ProfileSettingsMenuProps {
  alignRight?: boolean;
  isInContacts: boolean;
  isBlocked: boolean;
  handleRemoveContact: () => void;
  handleBlockUser: () => void;
  handleUnblockUser: () => void;
}

const ProfileSettingsMenu: React.FC<ProfileSettingsMenuProps> = ({
  alignRight,
  isInContacts,
  isBlocked,
  handleRemoveContact,
  handleBlockUser,
  handleUnblockUser,
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
        <DropdownContent alignRight={alignRight}>
          {isInContacts && (
            <SettingsMenuItem onClick={handleRemoveContact}>
              <MenuItemLeftContent>
                <MenuItemIcon>
                  <FontAwesomeIcon icon={faUserMinus} />
                </MenuItemIcon>
                <MenuItemText>Remove&nbsp;Contact</MenuItemText>
              </MenuItemLeftContent>
            </SettingsMenuItem>
          )}
          <BlockUser onClick={isBlocked ? handleUnblockUser : handleBlockUser}>
            <MenuItemLeftContent>
              <MenuItemIcon>
                <FontAwesomeIcon icon={faBan} />
              </MenuItemIcon>
              <MenuItemText>
                {isBlocked ? "Unblock User" : "Block User"}
              </MenuItemText>
            </MenuItemLeftContent>
          </BlockUser>
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};

export default ProfileSettingsMenu;
