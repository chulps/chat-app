import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';
import { LanguageProvider } from './contexts/LanguageContext';
import './global.css';

const basename = process.env.NODE_ENV === 'production'
  ? '/chat-app'
  : process.env.PUBLIC_URL || '';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router basename={basename}>
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