import { Socket } from "socket.io-client";
import { Message } from "../components/ChatRoom";
import { KeyboardEvent } from "react";
import { defaultContent } from '../contexts/LanguageContext';
import axios from "axios";
import { translateText } from "./translate";

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

export const saveMessageToLocalStorage = (chatroomId: string, message: Message) => {
  const storedMessages = localStorage.getItem(chatroomId);
  const messages = storedMessages ? JSON.parse(storedMessages) : [];
  messages.push(message);
  localStorage.setItem(chatroomId, JSON.stringify(messages));
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
  const systemMessage: Message = {
    text: `${submittedName} ${defaultContent["chat-joined"]}`,
    chatroomId,
    type: "system",
    language: preferredLanguage,
  };

  socket.emit("sendSystemMessage", systemMessage);
  saveMessageToLocalStorage(chatroomId, systemMessage); // Save to localStorage

  // Establish socket connection and join room
  socket.emit("joinRoom", {
    chatroomId,
    name: submittedName,
    language: preferredLanguage,
  });
};

export const handleVisibilityChange = (
  socket: Socket,
  chatroomId: string,
  name: string,
  setIsAway: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (document.visibilityState === "hidden") {
    setIsAway(true);
    socket.emit("userAway", { chatroomId, name });
  } else {
    setIsAway(false);
    socket.emit("userReturned", { chatroomId, name });
  }
};

export const handleBeforeUnload = (
  socket: Socket,
  chatroomId: string,
  name: string,
  preferredLanguage: string
) => {
  socket.emit("leaveRoom", { chatroomId, name });
  socket.emit("sendSystemMessage", {
    text: `${name} has left the chat.`,
    chatroomId,
    type: "system",
    language: preferredLanguage,
  });
};

export const handleStopRecording = async (
  blob: Blob,
  transcribeApiUrl: string,
  socket: Socket,
  name: string,
  chatroomId: string,
  preferredLanguage: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const formData = new FormData();
  formData.append('file', blob, 'audio.wav');

  try {
    const response = await axios.post(`${transcribeApiUrl}/api/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { transcription } = response.data;

    // Translate the transcription
    const translatedText = await translateText(transcription, preferredLanguage);

    // Send the transcribed message via socket
    const message: Message = {
      sender: name,
      text: translatedText,
      language: preferredLanguage,
      chatroomId: chatroomId || "",
      type: "user",
    };
    socket.emit("sendMessage", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  } catch (error) {
    console.error('Error during transcription or translation:', error);
  }
};
