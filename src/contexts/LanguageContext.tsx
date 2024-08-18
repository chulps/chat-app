import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { getEnv } from '../utils/getEnv';

const { translateUrl } = getEnv();

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  content: { [key: string]: string };
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const defaultContent = {
  'chatroomID': 'Chatroom ID',
  'back': 'Back',
  'chatroomsTabEmptyState': 'Join a chatroom.',
  'search-users-and-chatrooms': 'Search users and chatrooms',
  'find-your-friends': 'Find your friends by email address, username, or their actual name. Only public chatrooms are visible by search.',
  'register': 'Register',
  'home': 'Home',
  'theme': 'Theme',
  'settings': 'Settings',
  'profile': 'Profile',
  'dashboard': 'Dashboard',
  'dark': 'Dark',
  'light': 'Light',
  'logout': 'Logout',
  'about-this-app': 'About this app',
  'app-description': '"T" is for "Translation". Chat with anyone anywhere without any language barriers. Enter your name and then either create a chatroom or join one using the Chatroom ID. Be safe, and have fun!',
  'chat-joined': 'has joined the chat',
  'chat-left': 'has left the chat',
  'clear-button-text': 'Clear',
  'continue': 'Continue',
  'search-by-email': 'Search by email, username, name, or chatroom',
  'create': 'Create',
  'enter-chatroom-id': 'Enter Chatroom ID',
  'enter-name': 'Enter your name to join the chat',
  'exit': 'Exit',
  'join': 'Join',
  'no-match': 'No items matched your search query',
  'language': 'Language',
  'loading': 'Loading...',
  'members': 'Members',
  'or': 'or',
  'search': 'Search',
  'placeholder-message': 'Type a message...',
  'placeholder-name': 'Enter your name',
  'QRCode': 'QR Code',
  'search-language': 'Search language...',
  'searchbar-tip': 'Hold "Shift" + "Backspaace" to clear',
  'select-language': 'Select your preferred language from the menu.',
  'submit': 'Submit',
  'tooltip-chatroom-id-copied': 'Chatroom ID copied to clipboard!',
  'tooltip-copy-chatroom-id': 'Copy the chatroom ID to share with your friends.',
  'tooltip-copy-url': 'Copy chatroom URL',
  'tooltip-create': 'Create a chatroom and invite your friends to chat with them.',
  'tooltip-exit-chatroom': 'Exit the current chatroom',
  'tooltip-id-copied': 'Chatroom ID copied to clipboard',
  'tooltip-join': 'Join an existing chatroom using a Chatroom ID.',
  'tooltip-show-qrcode': 'Show QR code',
  'tooltip-theme-dark': 'Switch to dark theme',
  'tooltip-theme-light': 'Switch to light theme',
  'tooltip-url-copied': 'Chatroom URL copied to clipboard!',
  'URL': 'URL',
  'users': 'Users',
  'user-away': 'is away',
  'user-connected': 'has connected',
  'show-original': 'Show original?',
  'public': 'Public?',
  'user-returned': 'has returned',
  'cancel': 'Cancel',
  'send': 'Send',
  'tap-to-edit': 'Tap to edit',
  'stop-recording': 'Press the button to stop recording',
  'email': 'Email',
  'password': 'Password',
  'forgot-password': 'Forgot password?',
  'dont-have-an-account': "Don't have an account?",
  'sign-up': 'Sign up!',
  'login': 'Login',
  'create-an-account': 'Create an account',
  'username': 'Username',
  'chatroomName': 'Chatroom name',
  'example': 'Example',
  'i-agree': 'I agree to the ',
  'terms-and-conditions': 'terms and conditions',
  'already-have-an-account': 'Already have an account?',
  'chatrooms': 'Chatrooms',
  'contacts': 'Contacts',
  'leave-chatroom': 'Leave chatroom',
  'delete-chatroom': 'Delete chatroom',

};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => navigator.language);
  const [content, setContent] = useState<{ [key: string]: string }>(defaultContent);
  const memoizedTranslations = useRef<{ [key: string]: { [key: string]: string } }>({});

  const fetchContent = useCallback(async (language: string) => {
    const userLanguage = language.split("-")[0];
    
    // Skip translation if the language is English
    if (userLanguage === 'en') {
      setContent(defaultContent);
      return;
    }

    // Use memoized translations if available
    if (memoizedTranslations.current[userLanguage]) {
      setContent(memoizedTranslations.current[userLanguage]);
      return;
    }

    try {
      const response = await axios.post(`${translateUrl}/api/translate`, { text: JSON.stringify(defaultContent), targetLanguage: userLanguage });
      const translatedContent = JSON.parse(response.data.translatedText);
      memoizedTranslations.current[userLanguage] = translatedContent;
      setContent(translatedContent);
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  }, []);

  useEffect(() => {
    fetchContent(language);
  }, [language, fetchContent]);

  const value = useMemo(() => ({ language, setLanguage, content }), [language, content]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
