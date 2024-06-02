import React, { useEffect, useState, useRef, KeyboardEvent } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
  timestamp: string;
  type?: 'system' | 'user';
}

const ChatRoom: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const query = new URLSearchParams(useLocation().search);
  const name = query.get("name") || "Anonymous";
  const { language: preferredLanguage, content } = useLanguage();
  const navigate = useNavigate();
  const [tooltipText, setTooltipText] = useState(content['tooltip-copy-chatroom-id']);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (conversationContainerRef.current) {
      setTimeout(() => {
        if (conversationContainerRef.current) {
          conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const cleanupSocketListeners = () => {
    socket.off("connect");
    socket.off("message");
    socket.off("disconnect");
    socket.off("languageChangeAcknowledged");
    socket.off("messageHistory");
    socket.off("userTyping");
    socket.off("userJoined");
    socket.off("userLeft");
  };

  useEffect(() => {
    const handleLanguageChange = () => {
      socket.emit("languageChange", preferredLanguage);
    };

    socket.on("connect", () => {
      console.log("Connected to socket");
      socket.emit("joinRoom", {
        chatroomId,
        name,
        language: preferredLanguage,
      });
      socket.emit("sendSystemMessage", {
        text: `${name} has joined the chat.`,
        chatroomId,
        type: 'system',
        timestamp: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      });
    });

    socket.on("message", (message: Message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    socket.on("userTyping", (userName: string) => {
      console.log("User typing:", userName);
      setTypingUser(userName);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    });

    socket.on("userJoined", (userName: string) => {
      console.log("User joined:", userName);
      const systemMessage: Message = {
        sender: "",
        text: `${userName} has joined the chat.`,
        language: "",
        chatroomId: chatroomId || "", 
        timestamp: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: "system",
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    });

    socket.on("userLeft", (userName: string) => {
      console.log("User left:", userName);
      const systemMessage: Message = {
        sender: "",
        text: `${userName} has left the chat.`,
        language: "",
        chatroomId: chatroomId || "",
        timestamp: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: "system",
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      socket.emit("leaveRoom", { chatroomId, name });
      socket.emit("sendSystemMessage", {
        text: `${name} has left the chat.`,
        chatroomId,
        type: 'system',
        timestamp: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      });
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
      console.log("Received message history:", history);
      setMessages(history);
      scrollToBottom();
    });

    handleLanguageChange();

    return cleanupSocketListeners;
  }, [chatroomId, name, preferredLanguage]);

  useEffect(() => {
    setTooltipText(content['tooltip-copy-chatroom-id']);
  }, [content]);

  const sendMessage = () => {
    const message: Message = {
      text: inputMessage,
      sender: name,
      language: preferredLanguage,
      chatroomId: chatroomId || "", 
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      type: "user",
    };
    console.log("Sending message:", message);
    socket.emit("sendMessage", message);
    setInputMessage("");
  };

  const emitUserTyping = () => {
    socket.emit("userTyping", { chatroomId, name });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
      setTypingUser(null);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } else {
      emitUserTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 2000); // Debounce for 2 seconds after user stops typing
    }
  };

  const handleCopyChatroomId = () => {
    if (chatroomId) {
      navigator.clipboard.writeText(chatroomId);
      setTooltipText(content['tooltip-id-copied']);
      setTimeout(() => {
        setTooltipText(content['tooltip-copy-chatroom-id']);
      }, 3000);
    }
  };

  return (
    <div>
      <div className="chatroom-header">
        <button
          data-tooltip={content['tooltip-exit-chatroom']}
          className="back-button small tooltip bottom-right"
          style={{ color: "var(--danger-300)", background: "var(--dark)" }}
          onClick={() => {
            socket.emit("sendSystemMessage", {
              text: `${name} has left the chat.`,
              chatroomId,
              type: 'system',
              timestamp: new Date().toLocaleTimeString(navigator.language, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            });
            socket.emit("leaveRoom", { chatroomId, name });
            setTimeout(() => {
              navigate('/');
            }, 100); // Small delay to ensure the message is sent
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Exit
        </button>
        <div className="chatroom-id-container">
          <label>Chatroom ID:</label>
          <data
            className="copy-chatroom-id tooltip bottom-left"
            data-tooltip={tooltipText}
            onClick={handleCopyChatroomId}
          >
            <FontAwesomeIcon icon={faCopy} /> {chatroomId}
          </data>
        </div>
      </div>
      <div className="conversation-container" ref={conversationContainerRef}>
        {messages.map((message, index) => {
          console.log("Rendering message:", message);
          return (
            <div className="message-row" key={index}>
              <div
                className={`message-wrapper ${
                  message.sender === name ? "me" : ""
                } ${message.type === 'system' ? 'system-message' : ''}`}
              >
                {message.type !== 'system' && (
                  <small className="sender-name">{message.sender}</small>
                )}
                <div className={`message ${message.type === 'system' ? 'system-message' : ''}`}>
                  <TranslationWrapper targetLanguage={preferredLanguage}>
                    {message.text}
                  </TranslationWrapper>
                </div>
                <small className="font-family-data" style={{color: "var(--neutral-500)", margin: "0 var(--space-1) 0 auto", width: 'fit-content'}}>
                  {message.timestamp}
                </small>
              </div>
            </div>
          );
        })}
        {typingUser && <div className="typing-notification">{typingUser} is typing...</div>}
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
