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
import { Message as MessageType, Member } from "../types"; // Correct import path

const { socketUrl, transcribeApiUrl } = getEnv();

const socket = socketIOClient(socketUrl);

const ChatRoom: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const query = new URLSearchParams(useLocation().search);
  const initialName = query.get("name") || "Anonymous";
  const { language: preferredLanguage, content } = useLanguage();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();

  const [urlTooltipText, setUrlTooltipText] = useState(
    content["tooltip-copy-chatroom-url"]
  );
  const [idTooltipText, setIdTooltipText] = useState(
    content["tooltip-copy-chatroom-id"]
  );
  const [qrCodeIsVisible, setQrCodeIsVisible] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [chatroomName, setChatroomName] = useState("");
  const [membersCount, setMembersCount] = useState(0);
  const [name, setName] = useState(user?.username || initialName);

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

  const [isPublic, setIsPublic] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const [isOriginator, setIsOriginator] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [repliedMessage, setRepliedMessage] = useState<MessageType | null>(
    null
  );

  const fetchChatroomDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${getEnv().apiUrl}/api/chatrooms/${chatroomId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const chatroom = response.data;

      console.log("Fetched chatroom details:", chatroom); // Log the fetched data

      setChatroomName(chatroom.name);
      setMembersCount(chatroom.members.length);
      const originator = chatroom.originator._id === user?.id;
      setIsOriginator(originator);
      setIsPublic(chatroom.isPublic);
      setMessages(
        chatroom.messages.map((msg: any) => ({
          ...msg,
          sender: msg.sender.username,
          readBy: msg.readBy,
          reactions: msg.reactions || [],
          repliedTo: msg.repliedTo || null,
        }))
      );
      setMembers(chatroom.members);
    } catch (error) {
      console.error("Error fetching chatroom details:", error); // Log the error
      alert('Failed to fetch chatroom details. Please try again later.'); // Optionally, show an alert or error message to the user
    }
  }, [chatroomId, getToken, user]);

  const fetchMembers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${getEnv().apiUrl}/api/chatrooms/${chatroomId}/members`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching chatroom members:", error);
    }
  }, [chatroomId, getToken]);

  const fetchChatrooms = useCallback(async () => {
    try {
      const response = await axios.get(`${getEnv().apiUrl}/api/chatrooms`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Fetched chatrooms:", response.data); // Log the fetched chatrooms
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
    }
  }, [getToken]);

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
    const qrMessage: MessageType = {
      sender: "system",
      text: chatroomUrl,
      language: preferredLanguage,
      chatroomId: chatroomId || "",
      type: "qr",
      readBy: [],
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
      socket.emit("joinRoom", {
        chatroomId,
        name,
        language: preferredLanguage,
      });
    }
  }, [chatroomId, name, preferredLanguage, isNamePromptVisible]);

  useEffect(() => {
    if (user) {
      fetchChatroomDetails();
    }
  }, [fetchChatroomDetails, user]);

  useEffect(() => {
    socket.on("updateMembersCount", (count) => {
      setMembersCount(count);
    });

    return () => {
      socket.off("updateMembersCount");
    };
  }, []);

  useEffect(() => {
    socket.on("chatroomDeleted", ({ chatroomId: deletedChatroomId }) => {
      if (deletedChatroomId === chatroomId) {
        if (user) {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      }
    });

    return () => {
      socket.off("chatroomDeleted");
    };
  }, [chatroomId, navigate, user]);

  const handleSendMessage = async (messageText?: string) => {
    const translatedText = await translateText(
      messageText || inputMessage,
      preferredLanguage
    );
  
    const newMessage: MessageType = {
      sender: name,
      text: translatedText,
      language: preferredLanguage,
      chatroomId: chatroomId || "",
      type: "user",
      repliedTo: repliedMessage?._id || null,  // Make sure repliedMessage._id is passed
      readBy: user?.id ? [user.id] : [],
    };
  
    // Add logging here
    console.log('Sending message payload:', newMessage);
  
    // Emit the message
    socket.emit("sendMessage", newMessage);
  
    // Clear input and reset replied message
    setInputMessage("");
    setRepliedMessage(null);  // Clear the replied message after sending
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

  const handleToggleIsPublic = async () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);

    try {
      await axios.put(
        `${getEnv().apiUrl}/api/chatrooms/${chatroomId}/public`,
        { isPublic: newIsPublic },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
    } catch (error) {
      console.error("Error updating chatroom public status:", error);
      setIsPublic(isPublic);
    }
  };

  const handleToggleShowOriginal = () => setShowOriginal((prev) => !prev);

  const handleTranscriptionConfirm = (editedText: string) => {
    handleSendMessage(editedText);
    setTranscriptionText(null);
    setIsRecording(false);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await axios.post(
        `${getEnv().apiUrl}/api/chatrooms/${chatroomId}/message/${messageId}/react`,
        { emoji },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
            : msg
        )
      );
    } catch (error) {
      console.error("Error reacting to message:", error);
    }
  };

  const handleReply = (messageId: string) => {
    const messageToReply = messages.find((msg) => msg._id === messageId);
    if (messageToReply) {
      console.log('Setting replied message:', messageToReply); // Debugging log
      setRepliedMessage(messageToReply);
    }
  };

  const handleEdit = async (messageId: string, newText: string) => {
    try {
      await axios.put(
        `${getEnv().apiUrl}/api/chatrooms/${chatroomId}/message/${messageId}`,
        { text: newText },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, text: newText } : msg
        )
      );
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await axios.delete(
        `${getEnv().apiUrl}/api/chatrooms/${chatroomId}/message/${messageId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
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
          chatroomName={chatroomName}
          membersCount={membersCount}
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
          isAuthenticated={!!user}
          isOriginator={isOriginator}
          handleToggleIsPublic={handleToggleIsPublic}
          isPublic={isPublic}
          handleToggleShowOriginal={handleToggleShowOriginal}
          showOriginal={showOriginal}
          fetchChatrooms={fetchChatrooms}
          members={members}
          fetchMembers={fetchMembers}
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
          showOriginal={showOriginal}
          handleReaction={handleReaction}
          handleReply={handleReply}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
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
          repliedMessage={repliedMessage} // Pass the repliedMessage prop
          setRepliedMessage={setRepliedMessage} // Pass the setRepliedMessage prop
        />
        {transcriptionText && (
          <TranscriptionModal
            transcriptionText={transcriptionText}
            setTranscriptionText={setTranscriptionText}
            onConfirm={handleTranscriptionConfirm}
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
