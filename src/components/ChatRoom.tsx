import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import ChatRoomHeader from "./ChatRoomHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import QRCodeModal from "./QRCodeModal";
import NamePrompt from "./NamePrompt";
import { useLanguage } from "../contexts/LanguageContext";
import { getEnv } from "../utils/getEnv";
import {
  setupSocketListeners,
  cleanupSocketListeners,
} from "../utils/socketListeners";
import {
  sendMessage,
  emitUserTyping,
  handleKeyPress,
  handleCopy,
  handleNameSubmit,
} from "../utils/chatRoomUtils";
import "../css/chatroom.css";

const { socketUrl } = getEnv();

const socket = socketIOClient(socketUrl);

export interface Message {
  sender?: string;
  text: string;
  language: string;
  chatroomId: string;
  timestamp?: string;
  type?: "system" | "user" | "qr";
}

const ChatRoom: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const query = new URLSearchParams(useLocation().search);
  const initialName = query.get("name") || "Anonymous";
  const { language: preferredLanguage, content } = useLanguage();
  const navigate = useNavigate();
  const [urlTooltipText, setUrlTooltipText] = useState(
    content["tooltip-copy-chatroom-url"]
  );
  const [idTooltipText, setIdTooltipText] = useState(
    content["tooltip-copy-chatroom-id"]
  );
  const [qrCodeIsVisible, setQrCodeIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [name, setName] = useState(initialName);
  const [isNamePromptVisible, setIsNamePromptVisible] = useState(
    initialName === "Anonymous"
  );
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAway, setIsAway] = useState(false);
  const [qrCodeMessageSent, setQrCodeMessageSent] = useState(false);
  console.log(qrCodeMessageSent)
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

  const sendQrCodeMessage = useCallback(() => {
    const chatroomUrl = `${window.location.origin}/chat-app/#/chatroom/${chatroomId}`;
    const qrMessage: Message = {
      sender: "system",
      text: chatroomUrl,
      language: preferredLanguage,
      chatroomId: chatroomId || "",
      type: "qr",
    };

    const qrCodeMessageSentBefore = localStorage.getItem("qrCodeMessageSent");

    if (!qrCodeMessageSentBefore) {
      setMessages((prevMessages) => [...prevMessages, qrMessage]);
      socket.emit("sendMessage", qrMessage);
      localStorage.setItem("qrCodeMessageSent", "true");
      setQrCodeMessageSent(true);
    }
  }, [chatroomId, preferredLanguage]);

  useEffect(() => {
    if (!isNamePromptVisible) {
      setupSocketListeners(
        socket,
        chatroomId || "",
        name,
        preferredLanguage,
        setMessages,
        setTypingUser,
        sendQrCodeMessage,
        scrollToBottom,
        typingTimeoutRef
      );

      sendQrCodeMessage(); // Call the sendQrCodeMessage function here

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          setIsAway(true);
          socket.emit("userAway", { chatroomId, name });
        } else {
          setIsAway(false);
          socket.emit("userReturned", { chatroomId, name });
        }
      };

      const handleBeforeUnload = () => {
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
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        cleanupSocketListeners(socket);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        localStorage.removeItem("qrCodeMessageSent"); // Remove the flag from local storage
      };
    }
  }, [
    chatroomId,
    name,
    preferredLanguage,
    isNamePromptVisible,
    sendQrCodeMessage,
    isAway,
  ]);

  useEffect(() => {
    setUrlTooltipText(content["tooltip-copy-chatroom-id"]);
  }, [content]);

  const handleSendMessage = () => {
    sendMessage(
      socket,
      inputMessage,
      name,
      preferredLanguage,
      chatroomId || "",
      setInputMessage
    );
  };

  const handleEmitUserTyping = () => {
    emitUserTyping(
      socket,
      chatroomId || "",
      name,
      typingTimeoutRef,
      setTypingUser
    );
  };

  const handleShowQrCode = () => {
    setQrCodeIsVisible((prevState) => !prevState);
  };

  return (
    <main className="chatroom">
      {isNamePromptVisible && (
        <NamePrompt
          onSubmit={(submittedName) =>
            handleNameSubmit(
              socket,
              submittedName,
              setName,
              setIsNamePromptVisible,
              chatroomId || "",
              preferredLanguage
            )
          }
        />
      )}
      <div className={`chatroom-container ${isNamePromptVisible ? "blur" : ""}`}>
        <ChatRoomHeader
          chatroomId={chatroomId || ""}
          name={name}
          qrCodeIsVisible={qrCodeIsVisible}
          urlTooltipText={urlTooltipText}
          idTooltipText={idTooltipText}
          content={content}
          preferredLanguage={preferredLanguage}
          handleCopyChatroomUrl={() =>
            handleCopy(
              `${window.location.origin}/chat-app/#/chatroom/${chatroomId}`,
              setUrlTooltipText,
              content["tooltip-url-copied"],
              content["tooltip-copy-url"]
            )
          }
          handleCopyChatroomId={() =>
            handleCopy(
              `${chatroomId}`,
              setIdTooltipText,
              content["tooltip-chatroom-id-copied"],
              content["tooltip-copy-chatroom-id"]
            )
          }
          handleShowQrCode={handleShowQrCode}
          handleLeaveRoom={() => {
            socket.emit("sendSystemMessage", {
              text: `${name} ${content['chat-left']}.`,
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
        />
        {qrCodeIsVisible && (
          <QRCodeModal
            chatroomUrl={`${window.location.origin}/chat-app/#/chatroom/${chatroomId}`}
          />
        )}
        <MessageList
          messages={messages}
          name={name}
          preferredLanguage={preferredLanguage}
          conversationContainerRef={conversationContainerRef}
        />
        <TypingIndicator typingUser={typingUser} />
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={handleSendMessage}
          handleKeyPress={(e) =>
            handleKeyPress(e, handleSendMessage, handleEmitUserTyping)
          }
          isNamePromptVisible={isNamePromptVisible}
        />
      </div>
    </main>
  );
};

export default ChatRoom;