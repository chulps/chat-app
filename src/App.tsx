import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';
import './global.css';
import { subscribeUser } from './utils/subscribe';

const App: React.FC = () => {
  const applicationServerKey = 'BF8O2sWTtQEjuN0z5Me4Eay0Se_MPuJjRsrurGwQuDgzKBtHf7hIe3ukSOU9cInU9-jLM8qOhuVF9lF1IP0KByI';
  useEffect(() => {
    subscribeUser(applicationServerKey);
  }, []);

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
