import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';
import Tabs, { Tab } from './Tabs'; // Import the Tabs and Tab components
import {
  faAddressBook,
  faComments,
  faBell
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
}

interface FriendRequest {
  sender: Friend;
  status: string;
}

interface DecodedToken {
  id: string;
}

const DashboardContainer = styled.div`
  padding-top: var(--space-3);
`;

const Dashboard: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const { apiUrl } = getEnv();
  const { getToken, token } = useAuth();
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

  const handleAddFriend = async (email: string) => {
    try {
      await axios.post(`${apiUrl}/api/friends/send-request`, { email }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchFriends();
    } catch (error) {
      console.error('Error sending friend request:', error);
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

  let decodedToken: DecodedToken | null = null;
  try {
    if (token) {
      decodedToken = jwtDecode<DecodedToken>(token);
      console.log("Decoded Token:", decodedToken);
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }

  return (
    <DashboardContainer>
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
          {/* Add friend */}
          <div>
            <h2>Add Friend</h2>
            <input
              type="text"
              placeholder="Friend's Email"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddFriend(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          {/* List of friends */}
          <div>
            <h2>Friends</h2>
            <ul>
              {friends.map((friend) => (
                <li key={friend._id}>
                  {friend.profileImage && (
                    <img
                      src={`${apiUrl}/${friend.profileImage}`}
                      alt={`${friend.username}'s profile`}
                      width="50"
                      height="50"
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
                    <img
                      src={`${apiUrl}/${request.sender.profileImage}`}
                      alt={`${request.sender.username}'s profile`}
                      width="50"
                      height="50"
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
      </Tabs>
    </DashboardContainer>
  );
};

export default Dashboard;
