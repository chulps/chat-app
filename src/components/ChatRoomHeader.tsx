import React, { useState, useEffect, useCallback } from "react";
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
  faUserPlus,
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
  width: var(--space-3);
  height: var(--space-3);
  border-radius: 50%;
  margin-right: 0.5em;
  object-fit: cover;
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

const AddFriendContainer = styled.div`
  position: relative;
`;

const AddFriendDropdown = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  right: 0;
  background: var(--dark);
  border: 1px solid var(--secondary);
  padding: 1em;
  width: var(--space-6);
  z-index: 1000;
  border-radius: 1em;
`;

const SearchBar = styled.input`
  width: 100%;
  margin-bottom: 0.5em;
  border: 1px solid var(--secondary);
  background: var(--dark);
  border-radius: 0.5em;
  color: var(--white);
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: var(--space-6);
  overflow-y: auto;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5em 0;
  cursor: pointer;

  &:hover {
    background: var(--secondary);
  }
`;

const ContactAvatar = styled.img`
  width: var(--space-3);
  height: var(--space-3);
  border-radius: 50%;
  margin-right: 0.5em;
  object-fit: cover;
`;

interface Member {
  _id: string;
  username: string;
  name: string;
  profileImage: string;
}

interface Contact extends Member {}

interface ChatRoomHeaderProps {
  chatroomId: string;
  chatroomName: string;
  membersCount: number;
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
  fetchChatrooms: () => void; // Added fetchChatrooms prop
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chatroomId,
  chatroomName,
  membersCount,
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
  fetchChatrooms, // Added fetchChatrooms prop
}) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms/${chatroomId}/members`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching chatroom members:", error);
    }
  }, [apiUrl, chatroomId, getToken]);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/friends/contacts`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setContacts(response.data.contacts);
      console.log("Fetched Contacts: ", response.data.contacts); // Debug log for fetched contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, [apiUrl, getToken]);

  useEffect(() => {
    if (isAccordionOpen) {
      fetchMembers();
    }
  }, [isAccordionOpen, fetchMembers]);

  useEffect(() => {
    if (isDropdownOpen) {
      fetchContacts();
    }
  }, [isDropdownOpen, fetchContacts]);

  const markMessagesAsRead = useCallback(async () => {
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
  }, [apiUrl, chatroomId, getToken]);

  useEffect(() => {
    markMessagesAsRead();
  }, [markMessagesAsRead]);

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

  const handleAddContactToChatroom = async (contactId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/chatrooms/${chatroomId}/add-member`,
        { memberId: contactId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setIsDropdownOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error adding contact to chatroom:", error);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !members.some((member) => member._id === contact._id)
  );

  useEffect(() => {
    console.log("Search Query: ", searchQuery);
    console.log("Filtered Contacts: ", filteredContacts);
  }, [searchQuery, filteredContacts]);

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
        {isAuthenticated && (
          <AddFriendContainer>
            <FontAwesomeIcon icon={faUserPlus} onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
            <AddFriendDropdown isOpen={isDropdownOpen}>
              <SearchBar
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ContactList>
                {filteredContacts.map((contact) => (
                  <ContactItem key={contact._id} onClick={() => handleAddContactToChatroom(contact._id)}>
                    {contact.profileImage && <ContactAvatar src={`${apiUrl}/${contact.profileImage}`} alt={contact.username} />}
                    <div>
                      <p>@{contact.username}</p>
                      <small>{contact.name}</small>
                    </div>
                  </ContactItem>
                ))}
              </ContactList>
            </AddFriendDropdown>
          </AddFriendContainer>
        )}
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
            <hr/>
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
                      <MemberAvatar src={`${apiUrl}/${member.profileImage}`} alt={`${apiUrl}/${member.profileImage}`} />
                      <div>
                        <p>{member.username}</p>
                        <small>{member.name}</small>
                      </div>
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
          </ChatroomSettingsMenu>
        )}
      </RightControlsContainer>
    </ChatroomHeaderContainer>
  );
};

export default ChatRoomHeader;
