import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [chatroomId, setChatroomId] = useState('');
  const { language } = useLanguage();
  const navigate = useNavigate();

  const createChatroom = () => {
    const newChatroomId = Math.random().toString(36).substring(2, 7);
    const chatroomUrl = `/chatroom/${newChatroomId}?name=${encodeURIComponent(name)}&language=${encodeURIComponent(language)}`;
    navigate(chatroomUrl);
    window.location.reload(); // Force reload to establish socket connection
  };

  const joinChatroom = () => {
    if (chatroomId) {
      const chatroomUrl = `/chatroom/${chatroomId}?name=${encodeURIComponent(name)}&language=${encodeURIComponent(language)}`;
      navigate(chatroomUrl);
      window.location.reload(); // Force reload to establish socket connection
    }
  };

  return (
    <div>
      <h1>Welcome to Babel Chat</h1>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createChatroom}>Create Chatroom</button>
      <input
        type="text"
        placeholder="Chatroom ID"
        value={chatroomId}
        onChange={(e) => setChatroomId(e.target.value)}
      />
      <button onClick={joinChatroom}>Join Chatroom</button>
    </div>
  );
};

export default HomePage;
