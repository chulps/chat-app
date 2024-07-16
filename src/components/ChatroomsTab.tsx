import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getEnv } from "../utils/getEnv";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const CreateChatroomInputContainer = styled.div`
  display: flex;
  gap: var(--space-1);
`;

const DashboardList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--secondary);

    &:hover {
      background-color: var(--dark);
    }
  }
`;

const EmptyState = styled.p`
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
`;

interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
}

interface ChatroomsTabProps {
  chatrooms: ChatRoom[];
  setChatrooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  filteredChatrooms: ChatRoom[];
  setFilteredChatrooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
}

const ChatroomsTab: React.FC<ChatroomsTabProps> = ({
  chatrooms,
  setChatrooms,
  filteredChatrooms,
  setFilteredChatrooms,
}) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const [newChatroomName, setNewChatroomName] = useState("");
  const [chatroomSearchQuery, setChatroomSearchQuery] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const createInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      createInputRef.current &&
      !createInputRef.current.contains(event.target as Node)
    ) {
      setShowCreateInput(false);
    }
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setShowSearchInput(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleChatroomSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setChatroomSearchQuery(query);
    if (query) {
      const filtered = chatrooms.filter((chatroom) =>
        chatroom.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChatrooms(filtered);
    } else {
      setFilteredChatrooms(chatrooms);
    }
  };

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

  return (
    <>
      <TabHeader>
        <h4>Chatrooms</h4>
        <IconsContainer>
          <FontAwesomeIcon
            icon={faPlus}
            onClick={() => setShowCreateInput(!showCreateInput)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => setShowSearchInput(!showSearchInput)}
          />
        </IconsContainer>
      </TabHeader>

      {showCreateInput && (
        <CreateChatroomInputContainer ref={createInputRef}>
          <input
            type="text"
            value={newChatroomName}
            onChange={(e) => setNewChatroomName(e.target.value)}
            placeholder="Chatroom Name"
          />
          <button onClick={createChatroom}>Create</button>
        </CreateChatroomInputContainer>
      )}

      {showSearchInput && (
        <input
          ref={searchInputRef}
          type="text"
          value={chatroomSearchQuery}
          onChange={handleChatroomSearchChange}
          placeholder="Search Chatrooms"
        />
      )}

      {filteredChatrooms.length === 0 && (
        <EmptyState>
          You haven't joined any chatrooms yet. Create one or join an existing
          chatroom.
        </EmptyState>
      )}

      <DashboardList>
        {filteredChatrooms.map((chatroom) => (
          <li key={chatroom._id}>
            <Link to={`/chatroom/${chatroom._id}`}>{chatroom.name}</Link>
          </li>
        ))}
      </DashboardList>
    </>
  );
};

export default ChatroomsTab;
