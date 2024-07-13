import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import Tabs, { Tab } from "./Tabs";
import {
  faAddressBook,
  faComments,
  faBell,
  faMagnifyingGlass,
  faUsers,
  faComments as faCommentsAlt,
  faList,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
}

interface Friend {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  name?: string;
}

interface FriendRequest {
  sender: Friend;
  status: string;
}

const DashboardContainer = styled.div`
  padding-top: var(--space-3);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-2);
  background-color: var(--dark);
  border-radius: var(--space-1);
  margin-bottom: var(--space-3);
`;

const UserProfileImage = styled.img`
  width: calc(var(--space-4) + var(--space-1));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--space-2);
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: var(--font-size-4);
  font-weight: bold;
`;

const UserUsername = styled.span`
  font-size: var(--font-size-2);
  color: var(--gray-500);
`;

const SearchResults = styled.div`
  background-color: inherit;
  padding-top: var(--space-2);
  position: absolute;
  width: 100%;
  z-index: 1000;
  height: calc(100vh - 354px);
  overflow-y: auto;

  @media (min-width: 420px) {
    height: calc(100vh - 376px);
  }

  @media (min-width: 576px) {
    height: calc(100vh - 398px);
  }
`;

const SearchResultItem = styled.div`
  padding: var(--space-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);

  &:hover {
    background-color: var(--dark);
  }
`;

const ProfileImage = styled.img`
  width: calc(var(--space-3) + var(--space-2));
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const CreateChatroomInputContainer = styled.div`
  display: flex;
  gap: var(--space-1);
`;

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

const ContactListItemLeftContent = styled.div`
  display: flex;
  gap: var(--space-1);
`;

const Dashboard: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [filteredChatrooms, setFilteredChatrooms] = useState<ChatRoom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [chatroomSearchQuery, setChatroomSearchQuery] = useState("");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: Friend[];
    chatrooms: ChatRoom[];
  }>({ users: [], chatrooms: [] });
  const { apiUrl } = getEnv();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFriendSearchInput, setShowFriendSearchInput] = useState(false);

  const createInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const friendSearchInputRef = useRef<HTMLInputElement>(null);

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

  const fetchChatrooms = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms(response.data);
      setFilteredChatrooms(response.data);
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
    }
  }, [apiUrl, getToken]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFriends(response.data.friends);
      setFilteredFriends(response.data.friends);
      setFriendRequests(response.data.friendRequests);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, [apiUrl, getToken]);

  const fetchSearchResults = useCallback(
    async (query: string) => {
      try {
        const response = await axios.get(`${apiUrl}/api/search`, {
          params: { query },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
    [apiUrl, getToken]
  );

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      fetchSearchResults(query);
    } else {
      setSearchResults({ users: [], chatrooms: [] });
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleChatroomClick = (chatroomId: string) => {
    navigate(`/chatroom/${chatroomId}`);
  };

  useEffect(() => {
    fetchChatrooms();
    fetchFriends();
  }, [fetchChatrooms, fetchFriends]);

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

  const leaveChatroom = async (chatroomId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/chatrooms/leave`,
        { chatroomId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const updatedChatrooms = chatrooms.filter(
        (chatroom) => chatroom._id !== chatroomId
      );
      setChatrooms(updatedChatrooms);
      setFilteredChatrooms(updatedChatrooms);
    } catch (error) {
      console.error("Error leaving chatroom:", error);
    }
  };

  const handleAcceptFriendRequest = async (senderId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/friends/accept-request`,
        { senderId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (senderId: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/friends/reject-request`,
        { senderId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchFriends();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
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
    <DashboardContainer className="dashboard-container">
      {user && (
        <UserInfo>
          {user.profileImage && (
            <UserProfileImage
              src={`${apiUrl}/${user.profileImage}`}
              alt={user.username}
            />
          )}
          <UserDetails>
            <UserName>{user.name}</UserName>
            <UserUsername>@{user.username}</UserUsername>
          </UserDetails>
        </UserInfo>
      )}
      <Tabs>
        <Tab label="Chatrooms" icon={faComments}>
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

          {/* Empty state with no chatrooms */}
          {filteredChatrooms.length === 0 && (
            <EmptyState>
              You haven't joined any chatrooms yet. Create one or join an
              existing chatroom.
            </EmptyState>
          )}

          {/* List of chatrooms */}
          <DashboardList>
            {filteredChatrooms.map((chatroom) => (
              <li key={chatroom._id}>
                <Link to={`/chatroom/${chatroom._id}`}>{chatroom.name}</Link>
                <button onClick={() => leaveChatroom(chatroom._id)}>
                  Leave
                </button>
              </li>
            ))}
          </DashboardList>
        </Tab>
        <Tab label="Contacts" icon={faAddressBook}>
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
              {/* Empty state with no friends */}
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

          {/* List of friends */}
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
        </Tab>
        <Tab label="Notifications" icon={faBell}>
          {/* List of friend requests */}
          <div>
            <h2>Friend Requests</h2>
            <DashboardList>
              {friendRequests.map((request) => (
                <li key={request.sender._id}>
                  {request.sender.profileImage && (
                    <ProfileImage
                      src={`${apiUrl}/${request.sender.profileImage}`}
                      alt={`${request.sender.username}'s profile`}
                    />
                  )}
                  {request.sender.username} ({request.sender.email})
                  <button
                    onClick={() =>
                      handleAcceptFriendRequest(request.sender._id)
                    }
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleRejectFriendRequest(request.sender._id)
                    }
                  >
                    Reject
                  </button>
                </li>
              ))}
            </DashboardList>
          </div>
        </Tab>
        <Tab label="Search" icon={faMagnifyingGlass}>
          <div>
            <h2>Search Users and Chatrooms</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by email, username, name, or chatroom"
            />

            {/* Empty state */}
            {searchQuery === "" && (
              <EmptyState>
                Start typing to search users and chatrooms...
              </EmptyState>
            )}

            {searchQuery !== "" && (
              <SearchResults>
                <Tabs>
                  <Tab label="All" icon={faList}>
                    <div>
                      <label>Users</label>
                      {searchResults.users.length === 0 ? (
                        <EmptyState>
                          No users match your search query
                        </EmptyState>
                      ) : (
                        searchResults.users.map((user) => (
                          <SearchResultItem
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                          >
                            {user.profileImage && (
                              <ProfileImage
                                src={`${apiUrl}/${user.profileImage}`}
                                alt={user.username}
                              />
                            )}
                            <div>
                              @{user.username}
                              <br />
                              <small>
                                ({user.email}) {user.name && `- ${user.name}`}
                              </small>
                            </div>
                          </SearchResultItem>
                        ))
                      )}
                    </div>
                    <div>
                      <label>Chatrooms</label>
                      {searchResults.chatrooms.length === 0 ? (
                        <EmptyState>
                          No chatrooms match your search query
                        </EmptyState>
                      ) : (
                        searchResults.chatrooms.map((chatroom) => (
                          <SearchResultItem
                            key={chatroom._id}
                            onClick={() => handleChatroomClick(chatroom._id)}
                          >
                            {chatroom.name}
                          </SearchResultItem>
                        ))
                      )}
                    </div>
                  </Tab>
                  <Tab label="Users" icon={faUsers}>
                    <div>
                      <label>Users</label>
                      {searchResults.users.length === 0 ? (
                        <EmptyState>
                          No users match your search query
                        </EmptyState>
                      ) : (
                        searchResults.users.map((user) => (
                          <SearchResultItem
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                          >
                            {user.profileImage && (
                              <ProfileImage
                                src={`${apiUrl}/${user.profileImage}`}
                                alt={user.username}
                              />
                            )}
                            <div>
                              @{user.username}
                              <small>
                                ({user.email}) {user.name && `- ${user.name}`}
                              </small>
                            </div>
                          </SearchResultItem>
                        ))
                      )}
                    </div>
                  </Tab>
                  <Tab label="Chatrooms" icon={faCommentsAlt}>
                    <div>
                      <label>Chatrooms</label>
                      {searchResults.chatrooms.length === 0 ? (
                        <EmptyState>
                          No chatrooms match your search query
                        </EmptyState>
                      ) : (
                        searchResults.chatrooms.map((chatroom) => (
                          <SearchResultItem
                            key={chatroom._id}
                            onClick={() => handleChatroomClick(chatroom._id)}
                          >
                            {chatroom.name}
                          </SearchResultItem>
                        ))
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </SearchResults>
            )}
          </div>
        </Tab>
      </Tabs>
    </DashboardContainer>
  );
};

export default Dashboard;
