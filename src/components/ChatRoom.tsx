import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import axios from "axios";
import ChatRoomHeader from "./ChatRoomHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import QRCodeModal from "./QRCodeModal";
import NamePrompt from "./NamePrompt";
import WaveComponent from "./WaveComponent";
import TranscriptionModal from "./TranscriptionModal";
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
  handleVisibilityChange,
  handleBeforeUnload,
} from "../utils/chatRoomUtils";
import { translateText } from "../utils/translate";
import "../css/chatroom.css";
import { useAuth } from "../contexts/AuthContext";

const { socketUrl, transcribeApiUrl } = getEnv();

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
  const { user } = useAuth();

  console.log("User from AuthContext:", user);

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
  const [name, setName] = useState(user?.username || initialName);

  console.log("Initial name set to:", name);

  const [isNamePromptVisible, setIsNamePromptVisible] = useState(
    initialName === "Anonymous" && !user
  );
  const [transcriptionText, setTranscriptionText] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAway, setIsAway] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [qrCodeMessageSent, setQrCodeMessageSent] = useState(false);

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

      sendQrCodeMessage();

      const visibilityChangeHandler = () =>
        handleVisibilityChange(socket, chatroomId || "", name, setIsAway);
      const beforeUnloadHandler = () =>
        handleBeforeUnload(socket, chatroomId || "", name, preferredLanguage);

      document.addEventListener("visibilitychange", visibilityChangeHandler);
      window.addEventListener("beforeunload", beforeUnloadHandler);

      return () => {
        cleanupSocketListeners(socket);
        document.removeEventListener(
          "visibilitychange",
          visibilityChangeHandler
        );
        window.removeEventListener("beforeunload", beforeUnloadHandler);
        localStorage.removeItem("qrCodeMessageSent");
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

  useEffect(() => {
    if (user?.username) {
      setName(user.username);
      setIsNamePromptVisible(false);
    }
  }, [user]);

  useEffect(() => {
    if (name && !isNamePromptVisible) {
      socket.emit("joinRoom", { chatroomId, name, language: preferredLanguage });
    }
  }, [chatroomId, name, preferredLanguage, isNamePromptVisible]);

  const handleSendMessage = async (messageText?: string) => {
    setIsLoading(true);
    const translatedText = await translateText(
      messageText || inputMessage,
      preferredLanguage
    );
    sendMessage(
      socket,
      translatedText,
      name,
      preferredLanguage,
      chatroomId || "",
      setInputMessage
    );
    setIsLoading(false);
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

  const handleRecordingStop = async (blob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "audio.m4a");

    try {
      const response = await axios.post(
        `${transcribeApiUrl}/api/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { transcription } = response.data;
      setTranscriptionText(transcription);
    } catch (error) {
      console.error("Error during transcription:", error);
    }
    setIsLoading(false);
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
      <div
        className={`chatroom-container ${isNamePromptVisible ? "blur" : ""}`}
      >
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
              text: `${name} ${content["chat-left"]}.`,
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
            }, 100);
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
        {isLoading && (
          <div className="loading">
            <WaveComponent />
            <small className="font-family-data blink">Processing...</small>
          </div>
        )}
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={handleSendMessage}
          handleKeyPress={(e) =>
            handleKeyPress(e, handleSendMessage, handleEmitUserTyping)
          }
          isNamePromptVisible={isNamePromptVisible}
          onStopRecording={handleRecordingStop}
        />
        {transcriptionText && (
          <TranscriptionModal
            transcriptionText={transcriptionText}
            setTranscriptionText={setTranscriptionText}
            onConfirm={() => {
              handleSendMessage(transcriptionText);
              setTranscriptionText(null);
            }}
            onCancel={() => {
              setTranscriptionText(null);
              setIsRecording(false);
            }}
            setIsRecording={setIsRecording}
          />
        )}
      </div>
    </main>
  );
};

export default ChatRoom;
