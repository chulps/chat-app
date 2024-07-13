import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';
import Tabs, { Tab } from './Tabs';
import {
  faAddressBook,
  faComments,
  faBell,
  faMagnifyingGlass,
  faUsers,
  faComments as faCommentsAlt,
  faList
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

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

const Dashboard: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ users: Friend[], chatrooms: ChatRoom[] }>({ users: [], chatrooms: [] });
  const { apiUrl } = getEnv();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();

  const fetchChatrooms = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms(response.data);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
    }
  }, [apiUrl, getToken]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFriends(response.data.friends);
      setFriendRequests(response.data.friendRequests);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, [apiUrl, getToken]);

  const fetchSearchResults = useCallback(async (query: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/search`, {
        params: { query },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, [apiUrl, getToken]);

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
      const response = await axios.post(`${apiUrl}/api/chatrooms`, { name: newChatroomName }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms([...chatrooms, response.data]);
      setNewChatroomName('');
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };

  const leaveChatroom = async (chatroomId: string) => {
    try {
      await axios.post(`${apiUrl}/api/chatrooms/leave`, { chatroomId }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms(chatrooms.filter(chatroom => chatroom._id !== chatroomId));
    } catch (error) {
      console.error('Error leaving chatroom:', error);
    }
  };

  const handleAcceptFriendRequest = async (senderId: string) => {
    try {
      await axios.post(`${apiUrl}/api/friends/accept-request`, { senderId }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (senderId: string) => {
    try {
      await axios.post(`${apiUrl}/api/friends/reject-request`, { senderId }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchFriends();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const viewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const startChatWithFriend = async (friendId: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/chatrooms`,
        { name: 'Private Chat', members: [friendId] },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      navigate(`/chatroom/${response.data._id}`);
    } catch (error) {
      console.error('Error starting chatroom:', error);
    }
  };
  
  return (
    <DashboardContainer>
    {user && (
      <UserInfo>
        {user.profileImage && <UserProfileImage src={`${apiUrl}/${user.profileImage}`} alt={user.username} />}
        <UserDetails>
          <UserName>{user.name}</UserName>
          <UserUsername>@{user.username}</UserUsername>
        </UserDetails>
      </UserInfo>
    )}
      <Tabs>
        <Tab label="Chatrooms" icon={faComments}>
          {/* Empty state with no chatrooms */}
          {chatrooms.length === 0 && <p>Join or create a chatroom</p>}

          {/* Create chatroom */}
          <div>
            <h2>Create Chatroom</h2>
            <input
              type="text"
              value={newChatroomName}
              onChange={(e) => setNewChatroomName(e.target.value)}
              placeholder="Chatroom Name"
            />
            <button onClick={createChatroom}>Create</button>
          </div>

          {/* List of chatrooms */}
          <ul>
            {chatrooms.map((chatroom) => (
              <li key={chatroom._id}>
                <Link to={`/chatroom/${chatroom._id}`}>{chatroom.name}</Link>
                <button onClick={() => leaveChatroom(chatroom._id)}>Leave</button>
              </li>
            ))}
          </ul>
        </Tab>
        <Tab label="Contacts" icon={faAddressBook}>
          {/* List of friends */}
          <div>
            <h2>Contacts</h2>
            <ul>
              {friends.map((friend) => (
                <li key={friend._id}>
                  {friend.profileImage && (
                    <ProfileImage
                      src={`${apiUrl}/${friend.profileImage}`}
                      alt={`${friend.username}'s profile`}
                    />
                  )}
                  <span onClick={() => viewProfile(friend._id)}>
                    {friend.username} ({friend.email})
                  </span>
                  <button onClick={() => startChatWithFriend(friend._id)}>Start Chat</button>
                </li>
              ))}
            </ul>
          </div>
        </Tab>
        <Tab label="Notifications" icon={faBell}>
          {/* List of friend requests */}
          <div>
            <h2>Friend Requests</h2>
            <ul>
              {friendRequests.map((request) => (
                <li key={request.sender._id}>
                  {request.sender.profileImage && (
                    <ProfileImage
                      src={`${apiUrl}/${request.sender.profileImage}`}
                      alt={`${request.sender.username}'s profile`}
                    />
                  )}
                  {request.sender.username} ({request.sender.email})
                  <button onClick={() => handleAcceptFriendRequest(request.sender._id)}>Accept</button>
                  <button onClick={() => handleRejectFriendRequest(request.sender._id)}>Reject</button>
                </li>
              ))}
            </ul>
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
            {searchQuery && (
              <SearchResults>
                <Tabs>
                  <Tab label="All" icon={faList}>
                    <div>
                      <label>Users</label>
                      {searchResults.users.map((user) => (
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
                            @{user.username}<br/>
                            <small>({user.email}) {user.name && `- ${user.name}`}</small>
                          </div>
                        </SearchResultItem>
                      ))}
                    </div>
                    <div>
                      <label>Chatrooms</label>
                      {searchResults.chatrooms.map((chatroom) => (
                        <SearchResultItem
                          key={chatroom._id}
                          onClick={() => handleChatroomClick(chatroom._id)}
                        >
                          {chatroom.name}
                        </SearchResultItem>
                      ))}
                    </div>
                  </Tab>
                  <Tab label="Users" icon={faUsers}>
                    <div>
                      <label>Users</label>
                      {searchResults.users.map((user) => (
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
                            <small>({user.email}) {user.name && `- ${user.name}`}</small>
                          </div>
                        </SearchResultItem>
                      ))}
                    </div>
                  </Tab>
                  <Tab label="Chatrooms" icon={faCommentsAlt}>
                    <div>
                      <label>Chatrooms</label>
                      {searchResults.chatrooms.map((chatroom) => (
                        <SearchResultItem
                          key={chatroom._id}
                          onClick={() => handleChatroomClick(chatroom._id)}
                        >
                          {chatroom.name}
                        </SearchResultItem>
                      ))}
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
