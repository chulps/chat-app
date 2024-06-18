import ChatRoom from './components/ChatRoom';
import Chatrooms from './components/ChatRooms';
import CreateChatroom from './components/CreateChatRoom';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import React from 'react';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import { AuthProvider } from './contexts/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Settings from './components/Settings';
import TermsAndConditions from './components/TermsAndConditions'; // Import the component


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>

        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/chatroom/:chatroomId" element={<ProtectedRoute element={<ChatRoom />} />} />
        <Route path="/profile/:userId" element={<ProtectedRoute element={<Profile />} />} />
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
