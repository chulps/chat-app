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
  'tooltip-create': 'Create a chatroom and invite your friends to chat with them.',
  'tooltip-join': 'Join an existing chatroom using a Chatroom ID.',
  'placeholder-name': 'Your name',
  'enter-name': 'Enter your name to join the chat',
  'submit': 'Submit',
  'tooltip-chatroom-id-copied': 'Chatroom ID copied to clipboard!',
  'tooltip-copy-chatroom-id': 'Copy the chatroom ID to share with your friends.',
  'tooltip-copy-url': 'Copy chatroom URL',
  'tooltip-url-copied': 'Chatroom URL copied to clipboard!',
  'tooltip-theme-light': 'Switch to light theme',
  'tooltip-theme-dark': 'Switch to dark theme',
  'tooltip-exit-chatroom': 'Exit the current chatroom',
  'tooltip-id-copied': 'Chatroom ID copied to clipboard',
  'tooltip-show-qrcode': 'Show QR code',
  'loading': 'Loading...',
  'join': 'Join',
  'create': 'Create',
  'or': 'or',
  'app-description': '"T" is for "Translation". Chat with anyone anywhere without any language barriers. Enter your name and then either create a chatroom or join one using the Chatroom ID. Be safe, and have fun!',
  'about-this-app': 'About this app',
  'enter-chatroom-id': 'Enter Chatroom ID',
  'continue': 'Continue',
  'exit': 'Exit',
  'QRCode': 'QR Code',
  'URL': 'URL',
  'chat-joined': 'has joined the chat',
  'chat-left': 'has left the chat',
  'language': 'Language',
  'select-language': 'Select your preferred language from the menu.',
  'search-language': 'Search language...',
  'searchbar-tip': 'Hold "Shift" + "Backspaace" to clear',
  'clear-button-text': 'Clear',

  

  // Add more translations as needed
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

