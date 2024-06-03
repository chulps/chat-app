import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
  content: { [key: string]: string };
  setContent: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
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
  'create-chatroom': 'Create Chatroom',
  'join-chatroom': 'Join a Chatroom',
  'tooltip-create': 'Create a chatroom and invite your friends to chat with them.',
  'tooltip-join': 'Join an existing chatroom using a Chatroom ID.',
  'placeholder-name': 'Your name',
  'placeholder-chatroom-id': 'Chatroom ID',
  'tooltip-copy-chatroom-id': 'Copy the chatroom ID to share with your friends.',
  'tooltip-theme-light': 'Switch to light theme',
  'tooltip-theme-dark': 'Switch to dark theme',
  'tooltip-exit-chatroom': 'Exit the current chatroom',
  'tooltip-id-copied': 'Chatroom ID copied to clipboard',
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => navigator.language);
  const [content, setContent] = useState<{ [key: string]: string }>(defaultContent);
  const translationsFetched = useRef<{ [key: string]: boolean }>({});

  const fetchContent = useCallback(async (language: string) => {
    const userLanguage = language.split("-")[0];
    if (!translationsFetched.current[userLanguage]) {
      try {
        const response = await fetch(`http://localhost:3001/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: defaultContent, targetLanguage: userLanguage }),
        });
        // Check if the response is ok before trying to parse it as JSON
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const translatedContent = await response.json();
        setContent(translatedContent);
        translationsFetched.current[userLanguage] = true;
      } catch (error) {
        console.error('Error fetching translations:', error);
        // You can also display an error message to the user here
      }
    }
  }, []);

  useEffect(() => {
    fetchContent(language);
  }, [language, fetchContent]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, content, setContent }}>
      {children}
    </LanguageContext.Provider>
  );
};
