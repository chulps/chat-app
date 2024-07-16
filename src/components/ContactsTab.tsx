import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../utils/getEnv";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const DashboardList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    padding: 1em 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--secondary);
    &:first-of-type {
      border-top: none;
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

const ProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const ContactListItemLeftContent = styled.div`
  display: flex;
  gap: var(--space-1);
`;

interface Friend {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  name?: string;
}

interface ContactsTabProps {
  friends: Friend[];
  filteredFriends: Friend[];
  setFilteredFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
}

const ContactsTab: React.FC<ContactsTabProps> = ({
  friends,
  filteredFriends,
  setFilteredFriends,
}) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [showFriendSearchInput, setShowFriendSearchInput] = useState(false);

  const friendSearchInputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      friendSearchInputRef.current &&
      !friendSearchInputRef.current.contains(event.target as Node)
    ) {
      setShowFriendSearchInput(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleFriendSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFriendSearchQuery(query);
    if (query) {
      const filtered = friends.filter(
        (friend) =>
          friend.username.toLowerCase().includes(query.toLowerCase()) ||
          friend.email.toLowerCase().includes(query.toLowerCase()) ||
          (friend.name &&
            friend.name.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  };

  const viewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const startChatWithFriend = async (friendId: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/chatrooms`,
        { name: "Private Chat", members: [friendId] },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      navigate(`/chatroom/${response.data._id}`);
    } catch (error) {
      console.error("Error starting chatroom:", error);
    }
  };

  return (
    <>
      <TabHeader>
        <h4>Contacts</h4>
        <IconsContainer>
          <FontAwesomeIcon
            icon={faSearch}
            onClick={() => setShowFriendSearchInput(!showFriendSearchInput)}
          />
        </IconsContainer>
      </TabHeader>

      {showFriendSearchInput && (
        <>
          {friendSearchQuery === "" && (
            <EmptyState>Start typing to search contacts</EmptyState>
          )}
          <input
            ref={friendSearchInputRef}
            type="text"
            value={friendSearchQuery}
            onChange={handleFriendSearchChange}
            placeholder="Search Contacts"
          />
        </>
      )}

      {friendSearchQuery !== "" && filteredFriends.length === 0 && (
        <EmptyState>No users match your search query</EmptyState>
      )}

      <div>
        <DashboardList>
          {filteredFriends.map((friend) => (
            <li key={friend._id}>
              <ContactListItemLeftContent>
                {friend.profileImage && (
                  <ProfileImage
                    src={`${apiUrl}/${friend.profileImage}`}
                    alt={`${friend.username}'s profile`}
                  />
                )}
                <span onClick={() => viewProfile(friend._id)}>
                  <p>@{friend.username}</p>
                  <small>({friend.email})</small>
                </span>
              </ContactListItemLeftContent>
              <button onClick={() => startChatWithFriend(friend._id)}>
                Start Chat
              </button>
            </li>
          ))}
        </DashboardList>
      </div>
    </>
  );
};

export default ContactsTab;