import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCopy,
  faLink,
  faQrcode,
  faTimes,
  faUsers,
  faLanguage,
  faEye,
  faEyeSlash,
  faGlobe,
  faLock,
  faUnlock,
  faSignOutAlt,
  faTrash,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import ChatroomSettingsMenu from "./ChatroomSettingsMenu";
import ToggleSwitch from "./ToggleSwitch";
import styled from "styled-components";

const ChatroomHeaderContainer = styled.header`
  font-size: var(--font-size-h5);
  padding: 0.5em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatroomNameRow = styled.div`
  font-size: var(--font-size-h4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RightControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
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
  padding: 0;
  margin: 0;
`;

const MemberItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5em 0;
`;

const MemberAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5em;
`;

const ChatroomControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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

interface ChatRoomHeaderProps {
  chatroomId: string;
  chatroomName: string; // Updated to include chatroomName
  membersCount: number; // Added to include members count
  qrCodeIsVisible: boolean;
  urlTooltipText: string;
  idTooltipText: string;
  content: any;
  preferredLanguage: string;
  handleCopyChatroomUrl: () => void;
  handleCopyChatroomId: () => void;
  handleShowQrCode: () => void;
  handleLeaveRoom: () => void;
  isAuthenticated: boolean;
  isOriginator: boolean;
  handleToggleIsPublic: () => void;
  isPublic: boolean;
  handleToggleShowOriginal: () => void;
  showOriginal: boolean;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chatroomId,
  chatroomName, // Updated to include chatroomName
  membersCount, // Added to include members count
  qrCodeIsVisible,
  urlTooltipText,
  idTooltipText,
  content,
  preferredLanguage,
  handleCopyChatroomUrl,
  handleCopyChatroomId,
  handleShowQrCode,
  handleLeaveRoom,
  isAuthenticated,
  isOriginator,
  handleToggleIsPublic,
  isPublic,
  handleToggleShowOriginal,
  showOriginal,
}) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms/${chatroomId}/members`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMembers(response.data.members); // Correctly set members
    } catch (error) {
      console.error("Error fetching chatroom members:", error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/chatrooms/${chatroomId}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    if (isAccordionOpen) {
      fetchMembers();
    }
  }, [isAccordionOpen]);

  useEffect(() => {
    markMessagesAsRead();
  }, []);

  const leaveChatroom = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/chatrooms/leave`,
        { chatroomId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
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
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting chatroom:", error);
    }
  };

  return (
    <ChatroomHeaderContainer className="chatroom-header">
      <button
        data-tooltip={content["tooltip-exit-chatroom"]}
        className="back-button small tooltip bottom-right"
        style={{
          color: "var(--white)",
          background: "var(--dark)",
        }}
        onClick={() => navigate("/dashboard")}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        &nbsp;Back
      </button>
      <span>{chatroomName}</span>
      <RightControlsContainer>
        <span
          data-tooltip={content["tooltip-show-qrcode"]}
          className="show-qr-button small tooltip bottom"
          onClick={handleShowQrCode}
        >
          <FontAwesomeIcon icon={qrCodeIsVisible ? faTimes : faQrcode} />
        </span>
        <span
          data-tooltip={urlTooltipText}
          className="tooltip bottom-left"
          onClick={handleCopyChatroomUrl}
        >
          <FontAwesomeIcon icon={faLink} />
        </span>
        {isAuthenticated && (
          <ChatroomSettingsMenu alignRight>
            <ChatroomId
              data-tooltip={idTooltipText}
              className="copy-id tooltip bottom"
              onClick={handleCopyChatroomId}
            >
              <span>
                <label>Chatroom ID:</label>
                <data>{chatroomId}</data>
              </span>
              <FontAwesomeIcon icon={faCopy} />
            </ChatroomId>
            <AccordionContainer>
              <AccordionHeader onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
                <MenuItemLeftContent>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{membersCount} Members</span>
                </MenuItemLeftContent>
                <FontAwesomeIcon icon={isAccordionOpen ? faChevronUp : faChevronDown} />
              </AccordionHeader>
              <AccordionContent isOpen={isAccordionOpen}>
                <MemberList>
                  {members.map((member) => (
                    <MemberItem key={member._id}>
                      <MemberAvatar src={member.profileImage} alt={member.username} />
                      <div>
                        <p>{member.username}</p>
                        <small>{member.name}</small>
                      </div>
                    </MemberItem>
                  ))}
                </MemberList>
              </AccordionContent>
            </AccordionContainer>
            <hr/>
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
                <MenuItemText>Leave&nbsp;Chatroom</MenuItemText>
              </MenuItemLeftContent>
            </SettingsMenuItem>
            {isOriginator && (
              <SettingsMenuItem className="delete" onClick={deleteChatroom}>
                <MenuItemLeftContent>
                  <MenuItemIcon>
                    <FontAwesomeIcon icon={faTrash} />
                  </MenuItemIcon>
                  <MenuItemText>Delete&nbsp;Chatroom</MenuItemText>
                </MenuItemLeftContent>
              </SettingsMenuItem>
            )}
          </ChatroomSettingsMenu>
        )}
      </RightControlsContainer>
    </ChatroomHeaderContainer>
  );
};

export default ChatRoomHeader;
