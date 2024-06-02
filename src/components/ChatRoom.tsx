import React, { useEffect, useState, KeyboardEvent } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import TranslationWrapper from './TranslationWrapper';
import { useLanguage } from '../contexts/LanguageContext';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://limitless-lake-38337.herokuapp.com' 
  : 'http://localhost:3001';

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

  useEffect(() => {
    console.log('Component mounted');

    const handleLanguageChange = () => {
      console.log('Language change:', preferredLanguage);
      socket.emit("languageChange", preferredLanguage);
    };

    socket.on("connect", () => {
      console.log('Connected to socket');
      socket.emit("joinRoom", { chatroomId, name, language: preferredLanguage });
      console.log(`joinRoom event emitted for chatroom: ${chatroomId}, user: ${name}, language: ${preferredLanguage}`);
    });

    socket.on("message", (message: Message) => {
      console.log('Message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("messageHistory", (history: Message[]) => {
      console.log('Message history received:', history);
      setMessages(history);
    });

    socket.on("disconnect", () => {
      console.log('Disconnected from socket');
      socket.emit("leaveRoom", { chatroomId, name });
    });

    socket.on("languageChangeAcknowledged", () => {
      console.log('Language change acknowledged');
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({
          ...message,
          language: preferredLanguage,
        }))
      );
    });

    handleLanguageChange();

    return () => {
      console.log('Component unmounting');
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.off("languageChangeAcknowledged");
      socket.off("messageHistory");
    };
  }, [chatroomId, name, preferredLanguage]);

  const sendMessage = () => {
    const message = {
      text: inputMessage,
      sender: name,
      language: preferredLanguage,
      chatroomId,
    };
    console.log('Sending message:', message);
    socket.emit("sendMessage", message);
    setInputMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
