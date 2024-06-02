import React, { useEffect, useState, KeyboardEvent } from "react";
import { useParams, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import TranslationWrapper from "./TranslationWrapper";
import { useLanguage } from "../contexts/LanguageContext";
import { getEnv } from "../utils/getEnv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import "../css/chatroom.css";

const { socketUrl } = getEnv();

console.log("Connecting to:", socketUrl);

const socket = socketIOClient(socketUrl);

interface Message {
  sender: string;
  text: string;
  language: string;
  chatroomId: string;
  timestamp: string; // Add timestamp field
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
      socket.emit("joinRoom", {
        chatroomId,
        name,
        language: preferredLanguage,
      });
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

    socket.on("messageHistory", (history: Message[]) => {
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
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }), // Add timestamp when message is sent in 24-hour format
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
      <div className="chatroom-header">
        <button
          className="back-button small"
          style={{ color: "var(--danger-300)", background: "var(--dark)" }}
          onClick={() => window.history.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Exit
        </button>
        <div className="chatroom-id-container">
          <label>Chatroom ID:</label>
          <data
            className="copy-chatroom-id tooltip bottom-left"
            data-tooltip="Copy Chatroom ID"
            onClick={() => {
              if (chatroomId) {
                navigator.clipboard.writeText(chatroomId);
              }
            }}
          >
            <FontAwesomeIcon icon={faCopy} /> {chatroomId}
          </data>
        </div>
      </div>
      <div className="conversation-container">
        {messages.map((message, index) => (
          <div className="message-row" key={index}>
            <div
              className={`message-wrapper ${
                message.sender === name ? "me" : ""
              }`}
            >
              <small className="sender-name">{message.sender}</small>
              <div className="message">
                <TranslationWrapper targetLanguage={preferredLanguage}>
                  {message.text}
                </TranslationWrapper>
              </div>
                <small style={{color: "var(--neutral-500)", margin: "0 var(--space-1) 0 auto", width: 'fit-content'}}>
                  {message.timestamp}
                </small>
            </div>
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message"
        />
        <button
          className={`message-send-button ${
            inputMessage === "" ? "disabled" : ""
          }`}
          onClick={sendMessage}
          disabled={inputMessage === ""}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
