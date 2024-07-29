import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../utils/getEnv";
import { useAuth } from "../contexts/AuthContext";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faComment } from "@fortawesome/free-solid-svg-icons";
import { Friend, FriendRequest } from "../types";
import { Socket } from "socket.io-client";

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
  height: var(--space-3);
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
  margin-bottom: var(--space-2);
`;

const Contact = styled.li`
  cursor: pointer;
  padding: 1em;
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

const ContactsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const Badge = styled.span`
  padding: 0.2em 0.5em;
  display: inline;
  justify-content: center;
  align-items: center;
  width: fit-content;
  text-align: center;
  color: white;
  font-family: var(--font-family-data);
  background: var(--primary);
  font-size: var(--font-size-small);
  color: var (--white);
  box-shadow: 0 0 6px var(--primary);
  border-radius: 1em;
  text-shadow: 0 0 2px white;
`;

const ContactsLabel = styled.label`
  display: flex;
  margin-bottom: var(--space-1);
  align-items: center;
  gap: var(--space-1);
`;

const FriendRequestItem = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-1);
  border-top: 1px solid var(--dark);
`;

const FriendRequestListItemRightContent = styled.div`
  display: flex;
  gap: var(--space-1);
`;

interface ContactsTabProps {
  friends: Friend[];
  filteredFriends: Friend[];
  setFilteredFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  friendRequests: FriendRequest[];
  handleAcceptFriendRequest: (senderId: string) => Promise<void>;
  handleRejectFriendRequest: (senderId: string) => Promise<void>;
  user: any;
  socket: Socket;
}

const ContactsTab: React.FC<ContactsTabProps> = ({
  friends,
  filteredFriends,
  setFilteredFriends,
  friendRequests,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
  user,
  socket,
}) => {
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [showFriendSearchInput, setShowFriendSearchInput] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState<string | null>(null);

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

  const startChatWithFriend = async (event: React.MouseEvent, friend: Friend) => {
    event.stopPropagation();
    try {
      const payload = {
        name: friend.name || friend.username,
        members: [friend._id],
      };
      console.log('Starting chat with payload:', payload);
  
      const response = await axios.post(
        `${apiUrl}/api/chatrooms/private`,
        payload,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      console.log('Chatroom created:', response.data);
      navigate(`/chatroom/${response.data._id}`);
    } catch (error: unknown) {
      console.error("Error starting chatroom:", error);
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data: any } };
        if (axiosError.response) {
          console.error('Server responded with:', axiosError.response.data);
        }
      }
    }
  };

  const handleAcceptRequest = async (senderId: string) => {
    setLoadingRequests(senderId);
    await handleAcceptFriendRequest(senderId);
    setLoadingRequests(null);
  };

  const handleRejectRequest = async (senderId: string) => {
    setLoadingRequests(senderId);
    await handleRejectFriendRequest(senderId);
    setLoadingRequests(null);
  };

  return (
    <>
      <TabHeader>
        <h4>Contacts</h4>
        {friends.length > 0 && (
          <IconsContainer>
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => setShowFriendSearchInput(!showFriendSearchInput)}
            />
          </IconsContainer>
        )}
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

      <ContactsContainer>
        {friendRequests.length > 0 && (
          <div>
            <ContactsLabel>
              Friend Requests 
              <Badge>{friendRequests.length}</Badge>
            </ContactsLabel>
            <DashboardList>
              {friendRequests.map((request) => (
                <FriendRequestItem key={request.sender._id}>
                  <ContactListItemLeftContent>
                    {request.sender.profileImage ? (
                      <ProfileImage
                        src={`${apiUrl}/${request.sender.profileImage}`}
                        alt={`${request.sender.username}'s profile`}
                      />
                    ) : (
                      <ProfilePlaceholder>
                        {request.sender.username.charAt(0).toUpperCase()}
                      </ProfilePlaceholder>
                    )}
                    <UserInfo>
                      <UserName>@{request.sender.username}</UserName>
                      <Name>{request.sender.name}</Name>
                    </UserInfo>
                  </ContactListItemLeftContent>
                    <>
                    {loadingRequests === request.sender._id ? (
                      <div className="system-message blink info">Loading...</div>
                    ) : (
                      <FriendRequestListItemRightContent>
                        <ContactButton
                          className="success small"
                          onClick={() => handleAcceptRequest(request.sender._id)}
                        >
                          Accept
                        </ContactButton>
                        <ContactButton
                          className="secondary small"
                          onClick={() => handleRejectRequest(request.sender._id)}
                        >
                          Reject
                        </ContactButton>
                  </FriendRequestListItemRightContent>
                    )}
                    </>
                </FriendRequestItem>
              ))}
            </DashboardList>
          </div>
        )}
        {filteredFriends.length === 0 ? (
          <EmptyState>You don't have any contacts.</EmptyState>
        ) : (
          <div>
            <ContactsLabel>Your Contacts</ContactsLabel>
            <DashboardList>
              {filteredFriends
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((friend) => (
                  <Contact
                    key={friend._id}
                    onClick={() => viewProfile(friend._id)}
                  >
                    <ContactListItemLeftContent>
                      {friend.profileImage ? (
                        <ProfileImage
                          src={`${apiUrl}/${friend.profileImage}`}
                          alt={`${friend.username}'s profile`}
                        />
                      ) : (
                        <ProfilePlaceholder>
                          {friend.username.charAt(0).toUpperCase()}
                        </ProfilePlaceholder>
                      )}
                      <UserInfo>
                        <UserName>@{friend.username}</UserName>
                        <Name>{friend.name}</Name>
                      </UserInfo>
                    </ContactListItemLeftContent>
                    <ContactListItemRightContent>
                      <ContactButton onClick={(e) => startChatWithFriend(e, friend)}>
                        <FontAwesomeIcon icon={faComment} />
                      </ContactButton>
                    </ContactListItemRightContent>
                  </Contact>
                ))}
            </DashboardList>
          </div>
        )}
      </ContactsContainer>
    </>
  );
};

export default ContactsTab;
