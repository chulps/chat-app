import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import { getEnv } from "../utils/getEnv";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronRight, faCrown } from "@fortawesome/free-solid-svg-icons";
import { Notification } from "../types";
import { Socket } from "socket.io-client";
import { ChatRoom } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import TranslationWrapper from "./TranslationWrapper";

const CreateChatroomInputContainer = styled.div`
  display: flex;
  gap: var(--space-1);
`;

const DashboardList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    padding: 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--dark);

    &:hover {
      background-color: var(--dark);
    }
  }
`;

const ChatroomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ChatroomNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ChatroomName = styled.span`
  font-size: var(--font-size-h5);
`;

const LatestMessage = styled.span`
  font-size: var(--font-size-h6);
  color: var(--secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LatestMessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const EmptyState = styled.div`
  color: var(--secondary);
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > * {
    aspect-ratio: 1/1;
    padding: 0.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TabHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
`;

const StyledLink = styled(RouterLink)`
  color: var(--white);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TimeOfLastMessage = styled.div`
  color: var(--secondary);
  display: flex;
  gap: var(--space-1);
  align-items: center;
  font-size: var(--font-size-small);

  svg[data-icon="crown"] {
    font-size: 9px;
    color: var(--warning);
    padding-bottom: 1px;
  }
`;

const NewMessageDot = styled.span`
  height: 0.5em;
  width: 0.5em;
  background-color: var(--primary);
  border-radius: 50%;
  margin-right: 0.5em;
`;

interface ChatroomsTabProps {
  chatrooms: ChatRoom[];
  setChatrooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  filteredChatrooms: ChatRoom[];
  setFilteredChatrooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  fetchChatrooms: () => void;
  user: any;
  socket: Socket;
}

const ChatroomsTab: React.FC<ChatroomsTabProps> = ({
  chatrooms,
  setChatrooms,
  filteredChatrooms,
  setFilteredChatrooms,
  fetchChatrooms,
  user,
  socket,
}) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const [newChatroomName, setNewChatroomName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const { content } = useLanguage();

  const createInputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      createInputRef.current &&
      !createInputRef.current.contains(event.target as Node)
    ) {
      setShowCreateInput(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const createChatroom = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/chatrooms`,
        { name: newChatroomName },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setChatrooms([...chatrooms, response.data]);
      setFilteredChatrooms([...chatrooms, response.data]);
      setNewChatroomName("");
      setShowCreateInput(false);
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
  };

  const markMessagesAsRead = async (chatroomId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/chatrooms/${chatroomId}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setChatrooms((prevChatrooms) =>
        prevChatrooms.map((chatroom) =>
          chatroom._id === chatroomId
            ? { ...chatroom, hasUnreadMessages: false }
            : chatroom
        )
      );
      setFilteredChatrooms((prevFilteredChatrooms) =>
        prevFilteredChatrooms.map((chatroom) =>
          chatroom._id === chatroomId
            ? { ...chatroom, hasUnreadMessages: false }
            : chatroom
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    fetchChatrooms();
    const interval = setInterval(fetchChatrooms, 30000); // Update every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fetchChatrooms]);

  useEffect(() => {
    if (user && socket) {
      socket.on("newNotification", (notification: Notification) => {
        if (notification.type === "chatroom_invite" || notification.type === "new_message") {
          fetchChatrooms();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, [user, socket, fetchChatrooms]);

  return (
    <>
      <TabHeader>
        <h4>{content["chatrooms"]}</h4>
        <IconsContainer>
          <FontAwesomeIcon
            icon={faPlus}
            onClick={() => setShowCreateInput(!showCreateInput)}
          />
        </IconsContainer>
      </TabHeader>

      {showCreateInput && (
        <CreateChatroomInputContainer ref={createInputRef}>
          <input
            type="text"
            value={newChatroomName}
            onChange={(e) => setNewChatroomName(e.target.value)}
            placeholder={content["chatroomName"]}
          />
          <button onClick={createChatroom}>{content['create']}</button>
        </CreateChatroomInputContainer>
      )}

      {filteredChatrooms.length === 0 && (
        <EmptyState>
          {content['chatroomsTabEmptyState']}
        </EmptyState>
      )}

      <DashboardList>
        {filteredChatrooms.map((chatroom) => (
          <li key={chatroom._id}>
            <StyledLink
              to={`/chatroom/${chatroom._id}`}
              onClick={() => markMessagesAsRead(chatroom._id)}
            >
              <ChatroomInfo>
                <ChatroomNameContainer>
                  {chatroom.hasUnreadMessages && <NewMessageDot />}
                  <ChatroomName>
                    <TranslationWrapper
                      targetLanguage={user?.language}
                      originalLanguage={chatroom.latestMessage?.language || 'en'}
                    >
                      {chatroom.name}
                    </TranslationWrapper>
                  </ChatroomName>
                </ChatroomNameContainer>
                {chatroom.latestMessage && (
                  <TimeOfLastMessage>
                    {chatroom.originator === user?.id && (
                      <FontAwesomeIcon icon={faCrown} />
                    )}
                    <div>
                      {new Date(chatroom.latestMessage.timestamp).toLocaleTimeString(
                        navigator.language,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </TimeOfLastMessage>
                )}
              </ChatroomInfo>
              {chatroom.latestMessage && (
                <LatestMessageContainer>
                  <LatestMessage>{chatroom.latestMessage.text}</LatestMessage>
                </LatestMessageContainer>
              )}
            </StyledLink>
          </li>
        ))}
      </DashboardList>
    </>
  );
};

export default ChatroomsTab;
