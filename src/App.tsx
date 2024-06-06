import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';
import './global.css';

const App: React.FC = () => {

  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatroom/:chatroomId" element={<ChatRoom />} />
        </Routes>
    </>
  );
};

export default App;
