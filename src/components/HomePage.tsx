// src/components/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [chatroomId, setChatroomId] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const createChatroom = () => {
    const newChatroomId = Math.random().toString(36).substring(7);
    navigate(`/chatroom/${newChatroomId}?name=${name}&language=${language}`);
  };

  const joinChatroom = () => {
    navigate(`/chatroom/${chatroomId}?name=${name}&language=${language}`);
  };

  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={createChatroom}>Create Chatroom</button>
      <input 
        type="text" 
        placeholder="Enter chatroom ID" 
        value={chatroomId} 
        onChange={(e) => setChatroomId(e.target.value)} 
      />
      <button onClick={joinChatroom}>Join Chatroom</button>
    </div>
  );
};

export default HomePage;
