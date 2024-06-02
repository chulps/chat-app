import React, { useEffect, useState, KeyboardEvent } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import TranslationWrapper from './TranslationWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import getEnv from '../utils/getEnv';

const currentEnv = getEnv();
const SOCKET_URL = currentEnv === 'production'
  ? 'https://limitless-lake-38337.herokuapp.com'
  : 'http://localhost:3001';

console.log('Connecting to:', SOCKET_URL);

const socket = socketIOClient(SOCKET_URL);

interface Message {
  sender: string;
  text: string;
  language: string;
  chatroomId: string;
}

const ChatRoom: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const query = new URLSearchParams(useLocation().search);
  const name = query.get("name") || "Anonymous";
  const { language: preferredLanguage } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const cleanupSocketListeners = () => {
    socket.off("connect");
    socket.off("message");
    socket.off("disconnect");
    socket.off("languageChangeAcknowledged");
    socket.off("messageHistory");
  };

  useEffect(() => {
    const handleLanguageChange = () => {
      socket.emit("languageChange", preferredLanguage);
    };

    socket.on("connect", () => {
      socket.emit("joinRoom", { chatroomId, name, language: preferredLanguage });
    });

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("disconnect", () => {
      socket.emit("leaveRoom", { chatroomId, name });
    });

    socket.on("languageChangeAcknowledged", () => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({
          ...message,
          language: preferredLanguage,
        }))
      );
    });

    socket.on('messageHistory', (history: Message[]) => {
      setMessages(history);
    });

    handleLanguageChange();

    return cleanupSocketListeners;
  }, [chatroomId, name, preferredLanguage]);

  const sendMessage = () => {
    const message = {
      text: inputMessage,
      sender: name,
      language: preferredLanguage,
      chatroomId,
    };
    socket.emit("sendMessage", message);
    setInputMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <h2>Chatroom: {chatroomId}</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}: </strong>
            <TranslationWrapper targetLanguage={preferredLanguage}>
              {message.text}
            </TranslationWrapper>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
