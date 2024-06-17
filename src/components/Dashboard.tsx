import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Correctly import jwtDecode
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
}

interface FriendRequest {
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  status: string;
}

interface DecodedToken {
  id: string;
}

const Dashboard: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const { apiUrl } = getEnv();
  const { getToken, token } = useAuth();

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
    <div>
      <h1>Dashboard</h1>

      {/* Empty state with no chatrooms */}
      {chatrooms.length === 0 && <p>No chatrooms available. Create one!</p>}

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
            {decodedToken && chatroom.originator === decodedToken.id && (
              <button onClick={() => leaveChatroom(chatroom._id)}>Leave</button>
            )}
          </li>
        ))}
      </ul>

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
            <li key={friend._id}>{friend.username} ({friend.email})</li>
          ))}
        </ul>
      </div>

      {/* List of friend requests */}
      <div>
        <h2>Friend Requests</h2>
        <ul>
          {friendRequests.map((request) => (
            <li key={request.sender._id}>
              {request.sender.username} ({request.sender.email})
              <button onClick={() => handleAcceptFriendRequest(request.sender._id)}>Accept</button>
              <button onClick={() => handleRejectFriendRequest(request.sender._id)}>Reject</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
