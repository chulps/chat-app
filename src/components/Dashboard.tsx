import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

interface Chatroom {
  _id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [friends, setFriends] = useState<string[]>([]);
  const { apiUrl } = getEnv();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchChatrooms();
    fetchProfile();
    fetchFriends();
  }, []);

  const fetchChatrooms = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chatrooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChatrooms(response.data);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
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
      setNewChatroomName('');
    } catch (error) {
      console.error('Error creating chatroom:', error);
    }
  };
  

  const handleCreateProfile = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleAddFriend = async (email: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/friends`, { email }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFriends([...friends, response.data.friendEmail]);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

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
          </li>
        ))}
      </ul>

      {/* Create profile */}
      <div>
        <h2>Create Profile</h2>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Bio"
        />
        <button onClick={handleCreateProfile}>Save Profile</button>
      </div>

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
      <ul>
        {friends.map((friend, index) => (
          <li key={index}>{friend}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
