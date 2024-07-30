import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

interface ChatRoom {
  _id: string;
  name: string;
  originator: string;
  members: string[];
  isPublic: boolean;
}

const ChatRooms: React.FC = () => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const { getToken } = useAuth();
  const { apiUrl } = getEnv();

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/chatrooms`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setChatrooms(response.data);
      } catch (error) {
        console.error('Error fetching chatrooms:', error);
      }
    };

    fetchChatrooms();
  }, [getToken, apiUrl]);

  return (
    <div>
      <h2>Chatrooms</h2>
      <ul>
        {chatrooms.map(chatroom => (
          <li key={chatroom._id}>{chatroom.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
