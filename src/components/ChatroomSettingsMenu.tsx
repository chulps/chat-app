import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTimes,
  faUsers,
  faChevronDown,
  faChevronUp,
  faCopy,
  faLanguage,
  faEye,
  faEyeSlash,
  faGlobe,
  faLock,
  faUnlock,
  faSignOutAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ToggleSwitch from "./ToggleSwitch";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import { useNavigate } from "react-router-dom";

const DropdownContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.span`
  padding: 0.5em;
  color: var(--white);
  cursor: pointer;
  font-size: var(--font-size-h4);
`;

const DropdownContent = styled.div<{ alignright?: boolean }>`
  position: absolute;
  top: calc(100% + 1em);
  ${({ alignright }) => (alignright ? "right: 0;" : "left: 0;")}
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

const AccordionContainer = styled.div`
  font-size: var(--font-size-default);
  padding: 1em;
`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: var(--space-1);
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  padding: 0.5em 0;
  background: var(--dark);
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const MemberList = styled.ul`
  list-style: none;
  padding: var(--space-1) 0 0 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
`;

const MemberItem = styled.li`
  display: flex;
  align-items: center;
`;

const MemberAvatar = styled.img`
  width: var(--space-3);
  height: var(--space-3);
  border-radius: 50%;
  object-fit: cover;
`;

const MemberPlaceholder = styled.div`
  width: var(--space-3);
  height: var(--space-3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary);
  color: var(--white);
  font-size: var(--font-size-small);
  font-weight: bold;
`;

const SettingsMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  gap: var(--space-3);
  background: var(--dark);

  &.leave,
  &.delete {
    color: var(--danger-300);
    border-top: 1px solid var(--secondary);

    &:hover {
      filter: brightness(1.3);
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

const ChatroomId = styled.span`
  font-size: var(--font-size-small);
  padding: 0.5em 1em 0.5em 1.1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: var(--dark);

  &:hover {
    filter: brightness(1.3);
  }

  & > svg {
    font-size: var(--font-size-default);
    margin-right: 0.4em;
  }
`;

interface Member {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

interface ChatroomSettingsMenuProps {
  alignright?: boolean;
  chatroomId: string;
  content: any;
  preferredLanguage: string;
  handleCopyChatroomId: () => void;
  handleToggleIsPublic: () => void;
  handleToggleShowOriginal: () => void;
  isPublic: boolean;
  showOriginal: boolean;
  fetchChatrooms: () => void;
  isOriginator: boolean;
  members: Member[];
  fetchMembers: () => void;
}

const ChatroomSettingsMenu: React.FC<ChatroomSettingsMenuProps> = ({
  alignright,
  chatroomId,
  content,
  preferredLanguage,
  handleCopyChatroomId,
  handleToggleIsPublic,
  handleToggleShowOriginal,
  isPublic,
  showOriginal,
  fetchChatrooms,
  isOriginator,
  members,
  fetchMembers,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isAccordionOpen) {
      fetchMembers();
    }
  }, [isAccordionOpen, fetchMembers]);

  const leaveChatroom = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/chatrooms/leave`,
        { chatroomId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchChatrooms(); // Fetch updated chatrooms list
      navigate("/dashboard");
    } catch (error) {
      console.error("Error leaving chatroom:", error);
    }
  };

  const deleteChatroom = async () => {
    try {
      await axios.delete(`${apiUrl}/api/chatrooms/${chatroomId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchChatrooms(); // Fetch updated chatrooms list
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting chatroom:", error);
    }
  };

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
        <DropdownContent alignright={alignright}>
          <ChatroomId
            data-tooltip={content["tooltip-copy-chatroom-id"]}
            className="copy-id tooltip bottom"
            onClick={handleCopyChatroomId}
          >
            <span>
              <label>{content['chatroomID']}:</label>
              <data>{chatroomId}</data>
            </span>
            <FontAwesomeIcon icon={faCopy} />
          </ChatroomId>
          <hr />
          <AccordionContainer>
            <AccordionHeader
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <MenuItemLeftContent>
                <FontAwesomeIcon icon={faUsers} />
                <span>{members.length} Members</span>
              </MenuItemLeftContent>
              <FontAwesomeIcon
                icon={isAccordionOpen ? faChevronUp : faChevronDown}
              />
            </AccordionHeader>
            <AccordionContent isOpen={isAccordionOpen}>
              <MemberList>
                {members.map((member) => (
                  <MemberItem key={member._id}>
                    {member.profileImage ? (
                      <MemberAvatar
                        src={`${apiUrl}/${member.profileImage}`}
                        alt={member.username}
                      />
                    ) : (
                      <MemberPlaceholder>
                        {member.username !== undefined
                          ? member.username.charAt(0).toUpperCase()
                          : ""}
                      </MemberPlaceholder>
                    )}
                  </MemberItem>
                ))}
              </MemberList>
            </AccordionContent>
          </AccordionContainer>
          <hr />
          <SettingsMenuItem>
            <MenuItemLeftContent>
              <FontAwesomeIcon icon={faLanguage} />
              <MenuItemText>Show&nbsp;original?</MenuItemText>
            </MenuItemLeftContent>
            <ToggleSwitch
              id="show-original-toggle"
              isOn={showOriginal}
              handleToggle={handleToggleShowOriginal}
              label={content["toggle-original"]}
              targetLanguage={preferredLanguage}
              onIcon={<FontAwesomeIcon icon={faEye} />}
              offIcon={<FontAwesomeIcon icon={faEyeSlash} />}
              onIconColor="var(--secondary)"
              offIconColor="var(--secondary)"
              onBackgroundColor="var(--dark)"
              offBackgroundColor="var(--dark)"
            />
          </SettingsMenuItem>
          {isOriginator && (
            <SettingsMenuItem>
              <MenuItemLeftContent>
                <MenuItemIcon>
                  <FontAwesomeIcon icon={faGlobe} />
                </MenuItemIcon>
                <MenuItemText>Public?</MenuItemText>
              </MenuItemLeftContent>
              <ToggleSwitch
                id="public-toggle"
                isOn={isPublic}
                handleToggle={handleToggleIsPublic}
                label={content["toggle-public"]}
                targetLanguage={preferredLanguage}
                onIcon={<FontAwesomeIcon icon={faUnlock} />}
                offIcon={<FontAwesomeIcon icon={faLock} />}
                onIconColor="var(--secondary)"
                offIconColor="var(--secondary)"
                onBackgroundColor="var(--dark)"
                offBackgroundColor="var(--dark)"
              />
            </SettingsMenuItem>
          )}
          <SettingsMenuItem className="leave" onClick={leaveChatroom}>
            <MenuItemLeftContent>
              <MenuItemIcon>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </MenuItemIcon>
              <MenuItemText>Leave Chatroom</MenuItemText>
            </MenuItemLeftContent>
          </SettingsMenuItem>
          {isOriginator && (
            <SettingsMenuItem className="delete" onClick={deleteChatroom}>
              <MenuItemLeftContent>
                <MenuItemIcon>
                  <FontAwesomeIcon icon={faTrash} />
                </MenuItemIcon>
                <MenuItemText>Delete Chatroom</MenuItemText>
              </MenuItemLeftContent>
            </SettingsMenuItem>
          )}
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};

export default ChatroomSettingsMenu;
