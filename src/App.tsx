import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import ChatRoom from './components/ChatRoom';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword'; 
import Chatrooms from './components/ChatRooms';
import CreateChatroom from './components/CreateChatRoom';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/chatroom/:chatroomId" element={<ProtectedRoute element={<ChatRoom />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/chatrooms" element={<ProtectedRoute element={<Chatrooms />} />} />
        <Route path="/create-chatroom" element={<ProtectedRoute element={<CreateChatroom />} />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
