// src/utils/socketListeners.ts
import { Socket } from "socket.io-client";
import { Message } from "../components/ChatRoom";

export const setupSocketListeners = (
  socket: Socket,
  chatroomId: string,
  name: string,
  preferredLanguage: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setTypingUser: React.Dispatch<React.SetStateAction<string | null>>,
  sendQrCodeMessage: () => void,
  scrollToBottom: () => void,
  typingTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
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

    sendQrCodeMessage(); // Ensure this is only called once
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
    setMessages(history);
    scrollToBottom();
  });

  socket.emit("languageChange", preferredLanguage);
};

export const cleanupSocketListeners = (socket: Socket) => {
  socket.off("connect");
  socket.off("message");
  socket.off("disconnect");
  socket.off("languageChangeAcknowledged");
  socket.off("messageHistory");
  socket.off("userTyping");
  socket.off("userJoined");
  socket.off("userLeft");
};
