// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';
import { LanguageProvider } from './contexts/LanguageContext';
import './global.css';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatroom/:chatroomId" element={<ChatRoom />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
