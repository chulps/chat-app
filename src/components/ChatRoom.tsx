import React, { useEffect, useState, useRef, KeyboardEvent, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import TranslationWrapper from "./TranslationWrapper";
import { useLanguage } from "../contexts/LanguageContext";
import { getEnv } from "../utils/getEnv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import "../css/chatroom.css";
import NamePrompt from "./NamePrompt";
import QRCodeMessage from "./QRCodeMessage";

const { socketUrl } = getEnv();

const socket = socketIOClient(socketUrl);

interface Message {
  sender: string;
  text: string;
  language: string;
  chatroomId: string;
  timestamp: string;
  type?: 'system' | 'user' | 'qr';
}

const ChatRoom: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const query = new URLSearchParams(useLocation().search);
  const initialName = query.get("name") || "Anonymous";
  const { language: preferredLanguage, content } = useLanguage();
  const navigate = useNavigate();
  const [tooltipText, setTooltipText] = useState(
    content["tooltip-copy-chatroom-id"]
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [name, setName] = useState(initialName);
  const [isNamePromptVisible, setIsNamePromptVisible] = useState(
    initialName === "Anonymous"
  );
  const [qrCodeSent, setQrCodeSent] = useState(false); // State to track if QR code message has been sent
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (conversationContainerRef.current) {
      setTimeout(() => {
        if (conversationContainerRef.current) {
          conversationContainerRef.current.scrollTop =
            conversationContainerRef.current.scrollHeight;
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

  const sendQrCodeMessage = useCallback(() => {
    if (!qrCodeSent) {
      const chatroomUrl = `${window.location.origin}/#/chatroom/${chatroomId}`;
      const qrMessage: Message = {
        sender: "system",
        text: chatroomUrl,
        language: preferredLanguage,
        chatroomId: chatroomId || "",
        timestamp: new Date().toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: "qr",
      };
      setMessages((prevMessages) => [...prevMessages, qrMessage]);
      socket.emit("sendMessage", qrMessage);
      setQrCodeSent(true); // Set the flag to true after sending the QR code message
    }
  }, [chatroomId, preferredLanguage, qrCodeSent]);

  useEffect(() => {
    if (!isNamePromptVisible) {
      const handleLanguageChange = () => {
        socket.emit("languageChange", preferredLanguage);
      };

      socket.on("connect", () => {
        socket.emit("joinRoom", {
          chatroomId,
          name,
          language: preferredLanguage,
        });
        socket.emit("sendSystemMessage", {
          text: `${name} has joined the chat.`,
          chatroomId,
          type: "system",
          timestamp: new Date().toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        });

        sendQrCodeMessage();
      });

      socket.on("message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });

      socket.on("userTyping", (userName: string) => {
        setTypingUser(userName);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser(null);
        }, 2000);
      });

      socket.on("userJoined", (userName: string) => {
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
        socket.emit("leaveRoom", { chatroomId, name });
        socket.emit("sendSystemMessage", {
          text: `${name} has left the chat.`,
          chatroomId,
          type: "system",
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
        // Check if QR code message is in history to avoid duplication
        const qrMessageExists = history.some(
          (message) => message.type === "qr"
        );
        setQrCodeSent(qrMessageExists);

        setMessages(history.filter((_, index) => index !== 2));
        scrollToBottom();
      });

      handleLanguageChange();

      return cleanupSocketListeners;
    }
  }, [
    chatroomId,
    name,
    preferredLanguage,
    isNamePromptVisible,
    sendQrCodeMessage,
  ]);

  useEffect(() => {
    setTooltipText(content["tooltip-copy-chatroom-id"]);
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
      }, 1000); // Debounce for 2 seconds after user stops typing
    }
  };

  const handleCopyChatroomUrl = () => {
    const chatroomUrl = `${window.location.origin}/#/chatroom/${chatroomId}`;
    navigator.clipboard.writeText(chatroomUrl).then(() => {
      setTooltipText(content["tooltip-url-copied"]);
      setTimeout(() => {
        setTooltipText(content["tooltip-copy-chatroom-id"]);
      }, 3000);
    });
  };

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
    setIsNamePromptVisible(false);

    // Emit system message for new user
    socket.emit("sendSystemMessage", {
      text: `${submittedName} has joined the chat.`,
      chatroomId,
      type: "system",
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });

    // Establish socket connection and join room
    socket.emit("joinRoom", {
      chatroomId,
      name: submittedName,
      language: preferredLanguage,
    });
  };

  return (
    <div>
      {isNamePromptVisible && <NamePrompt onSubmit={handleNameSubmit} />}
      <div
        className={`chatroom-container ${isNamePromptVisible ? "blur" : ""}`}
      >
        <div className="chatroom-header">
          <button
            data-tooltip={content["tooltip-exit-chatroom"]}
            className="back-button small tooltip bottom-right"
            style={{ color: "var(--danger-300)", background: "var(--dark)" }}
            onClick={() => {
              socket.emit("sendSystemMessage", {
                text: `${name} has left the chat.`,
                chatroomId,
                type: "system",
                timestamp: new Date().toLocaleTimeString(navigator.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
              });
              socket.emit("leaveRoom", { chatroomId, name });
              setTimeout(() => {
                navigate("/");
              }, 100); // Small delay to ensure the message is sent
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Exit
          </button>
          <div className="chatroom-id-container">
            <label>
              <TranslationWrapper targetLanguage={preferredLanguage}>
              Invite others
              </TranslationWrapper>
              </label>
            <data
              data-tooltip={tooltipText}
              className="copy-chatroom-url tooltip bottom-left"
              onClick={handleCopyChatroomUrl}
            >
              <FontAwesomeIcon icon={faCopy} /> 
              <TranslationWrapper targetLanguage={preferredLanguage}>
              Copy URL
              </TranslationWrapper>
            </data>
          </div>
        </div>
        <div className="conversation-container" ref={conversationContainerRef}>
          {messages
            .filter((_, index) => index !== 2)
            .map(
              (message, index) =>
                index !== 2 && (
                  <div className="message-row" key={index}>
                    <div
                      className={`message-wrapper ${
                        message.sender === name ? "me" : ""
                      } ${
                        message.type === "system" || message.type === "qr"
                          ? "system-message"
                          : ""
                      }`}
                    >
                      <div
                        className={`message ${
                          message.type === "system" || message.type === "qr"
                            ? "system-message"
                            : ""
                        }`}
                      >
                        {message.type === "qr" ? (
                          <QRCodeMessage
                            url={message.text}
                            key={message.text}
                          />
                        ) : (
                          <TranslationWrapper
                            targetLanguage={preferredLanguage}
                          >
                            {message.text}
                          </TranslationWrapper>
                        )}
                      </div>
                    </div>
                  </div>
                )
            )}

          {typingUser && (
            <div className="typing-notification">{typingUser} is typing...</div>
          )}
        </div>
        <div className="message-input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            disabled={isNamePromptVisible}
          />
          <button
            className={`message-send-button ${
              inputMessage === "" ? "disabled" : ""
            }`}
            onClick={sendMessage}
            disabled={inputMessage === "" || isNamePromptVisible}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
