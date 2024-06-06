// src/utils/chatRoomUtils.ts
import { Socket } from "socket.io-client";
import { Message } from "../components/ChatRoom";
import { useRef, KeyboardEvent } from "react";

export const sendMessage = (
  socket: Socket,
  inputMessage: string,
  name: string,
  preferredLanguage: string,
  chatroomId: string,
  setInputMessage: React.Dispatch<React.SetStateAction<string>>
) => {
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

export const emitUserTyping = (
  socket: Socket,
  chatroomId: string,
  name: string,
  typingTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setTypingUser: React.Dispatch<React.SetStateAction<string | null>>
) => {
  socket.emit("userTyping", { chatroomId, name });
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  typingTimeoutRef.current = setTimeout(() => {
    setTypingUser(null);
  }, 1000);
};

export const handleKeyPress = (
  e: KeyboardEvent<HTMLInputElement>,
  sendMessageFn: () => void,
  emitUserTypingFn: () => void
) => {
  if (e.key === "Enter") {
    sendMessageFn();
  } else {
    emitUserTypingFn();
  }
};

export const handleCopy = (
  text: string,
  setTooltipText: React.Dispatch<React.SetStateAction<string>>,
  copiedText: string,
  defaultText: string
) => {
  navigator.clipboard.writeText(text).then(() => {
    setTooltipText(copiedText);
    setTimeout(() => {
      setTooltipText(defaultText);
    }, 3000);
  });
};

export const handleNameSubmit = (
  socket: Socket,
  submittedName: string,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setIsNamePromptVisible: React.Dispatch<React.SetStateAction<boolean>>,
  chatroomId: string,
  preferredLanguage: string
) => {
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
