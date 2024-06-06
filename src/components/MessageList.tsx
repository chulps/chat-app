import React from "react";
import QRCodeMessage from "./QRCodeMessage";
import TranslationWrapper from "./TranslationWrapper";

interface Message {
  sender?: string;
  text: string;
  language: string;
  chatroomId: string;
  timestamp?: string;
  type?: "system" | "user" | "qr";
}

interface MessageListProps {
  messages: Message[];
  name: string;
  preferredLanguage: string;
  conversationContainerRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  name,
  preferredLanguage,
  conversationContainerRef
}) => {
  return (
    <div className="conversation-container" ref={conversationContainerRef}>
      {messages.map((message, index) => (
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
            {message.type !== "system" && message.type !== "qr" && (
              <small className="sender-name">{message.sender}</small>
            )}
            <div
              className={`message ${
                message.type === "system" || message.type === "qr"
                  ? "system-message"
                  : ""
              }`}
            >
              {message.type === "qr" ? (
                <QRCodeMessage url={message.text} />
              ) : (
                <TranslationWrapper targetLanguage={preferredLanguage}>
                  {message.text}
                </TranslationWrapper>
              )}
            </div>
            {message.type !== "system" && message.type !== "qr" && (
              <small
                style={{ color: "var(--neutral-400)" }}
                className="timestamp"
              >
                {message.timestamp}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
