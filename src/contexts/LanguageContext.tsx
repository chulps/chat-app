import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
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

const defaultContent = {
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
  // Add more translations as needed
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => navigator.language);
  const [content, setContent] = useState<{ [key: string]: string }>(defaultContent);
  const translationsFetched = useRef<{ [key: string]: boolean }>({});

  const fetchContent = useCallback(async (language: string) => {
    const userLanguage = language.split("-")[0];
    if (!translationsFetched.current[userLanguage]) {
      try {
        const response = await axios.post(`${translateUrl}/api/translate`, { text: JSON.stringify(content), targetLanguage: userLanguage });
        const translatedContent = response.data.translatedText;
        setContent(JSON.parse(translatedContent));
        translationsFetched.current[userLanguage] = true;
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    }
  }, [content]);

  useEffect(() => {
    fetchContent(language);
  }, [language, fetchContent]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
