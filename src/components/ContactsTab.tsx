import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../utils/getEnv";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faComment } from "@fortawesome/free-solid-svg-icons";

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
  padding-bottom: var(--space-2);
`;

const ProfileImage = styled.img`
  width: var(--space-3);
  height: var(--space-3);
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfilePlaceholder = styled.div`
  width: var(--space-3);
  height: var(--space-3);;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary);
  color: var(--white);
  font-size: var(--font-size-large);
  font-weight: bold;
`;

const ContactListItemLeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const UserName = styled.p`
  color: var(--white);
`;

const Name = styled.small`
  color: var(--secondary);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContactButton = styled.button`
  background: var(--site-background);
  padding: 0.5em;
  border-radius: 0.25em;

  &:hover {
    background: var(--dark);
    filter: brightness(1.2);
  }
`;

const ContactListItemRightContent = styled.div`
  display: none;
  align-items: center;
  @media screen and (hover: none) {
    display: flex;
  }
`;

const DashboardList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`;

const Contact = styled.li`
  cursor: pointer;
  padding: 1em 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--dark);

  &:hover {
    background-color: var(--dark);

    & > ${ContactListItemRightContent} {
      display: flex;
    }
  }
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

  const startChatWithFriend = async (friend: Friend) => {
    try {
      // Creating or finding an existing private chatroom with the friend
      const response = await axios.post(
        `${apiUrl}/api/chatrooms/private`,
        { name: friend.name || friend.username, members: [friend._id] },
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
            <Contact key={friend._id} onClick={() => viewProfile(friend._id)}>
              <ContactListItemLeftContent>
                {friend.profileImage ? (
                  <ProfileImage
                    src={`${apiUrl}/${friend.profileImage}`}
                    alt={`${friend.username}'s profile`}
                  />
                ) : (
                  <ProfilePlaceholder>{friend.username.charAt(0).toUpperCase()}</ProfilePlaceholder>
                )}
                <UserInfo>
                  <UserName>@{friend.username}</UserName>
                  <Name>{friend.name}</Name>
                </UserInfo>
              </ContactListItemLeftContent>
              <ContactListItemRightContent>
                <ContactButton>
                  <FontAwesomeIcon icon={faUser} />
                </ContactButton>
                <ContactButton onClick={() => startChatWithFriend(friend)}>
                  <FontAwesomeIcon icon={faComment} />
                </ContactButton>
              </ContactListItemRightContent>
            </Contact>
          ))}
        </DashboardList>
      </div>
    </>
  );
};

export default ContactsTab;
