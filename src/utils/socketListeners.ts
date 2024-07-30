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
    const joinMessage: Message = {
      text: `${name} has joined the chat.`,
      chatroomId,
      type: "system",
      language: preferredLanguage,
    };
    socket.emit("sendSystemMessage", joinMessage);
    sendQrCodeMessage();
  });

  socket.on("message", (message: Message) => {
    message.timestamp = new Date().toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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
      chatroomId,
      type: "system",
      language: "",
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  });

  socket.on("userLeft", (userName: string) => {
    const systemMessage: Message = {
      text: `${userName} has left the chat.`,
      chatroomId,
      type: "system",
      language: "",
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  });

  socket.on("userAway", (userName: string) => {
    const systemMessage: Message = {
      text: `${userName} is away.`,
      chatroomId,
      type: "system",
      language: "",
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  });

  socket.on("userReturned", (userName: string) => {
    const systemMessage: Message = {
      text: `${userName} has returned.`,
      chatroomId,
      type: "system",
      language: "",
      timestamp: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
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
    history.forEach((message) => {
      message.timestamp = new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });
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
  socket.off("userAway");
  socket.off("userReturned");
};
