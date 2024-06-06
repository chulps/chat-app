import React, { useState, useEffect, useCallback } from "react";
import QRCodeMessage from "./QRCodeMessage";
import TranslationWrapper from "./TranslationWrapper";
import { getUrlMetadata } from "../utils/urlUtils";

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
  conversationContainerRef,
}) => {
  const [urlMetadata, setUrlMetadata] = useState<{ [url: string]: any }>({});
  const [fetchedUrls, setFetchedUrls] = useState<Set<string>>(new Set());

  const fetchMetadata = useCallback(async () => {
    const newMetadata: { [url: string]: any } = {};
    const newFetchedUrls = new Set(fetchedUrls);

    for (const message of messages) {
      if (message.type === "user" && message.text.includes("http")) {
        const urls = message.text.match(/https?:\/\/[^\s]+/g);
        if (urls) {
          for (const url of urls) {
            if (!newFetchedUrls.has(url)) {
              try {
                const metadata = await getUrlMetadata(url);
                newMetadata[url] = metadata;
                newFetchedUrls.add(url);
              } catch (error) {
                console.error(`Error fetching metadata for ${url}:`, error);
              }
            }
          }
        }
      }
    }

    setUrlMetadata((prev) => ({ ...prev, ...newMetadata }));
    setFetchedUrls(newFetchedUrls);
  }, [messages, fetchedUrls]);

  useEffect(() => {
    if (messages.length > 0) {
      fetchMetadata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

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
                <>
                  <div className="message-text">
                    <TranslationWrapper targetLanguage={preferredLanguage}>
                      {message.text}
                    </TranslationWrapper>
                  </div>
                  {message.text.includes("http") &&
                    message.text.match(/https?:\/\/[^\s]+/g)?.map((url) => (
                      <div key={url} className="url-metadata">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {urlMetadata[url] ? (
                            <>
                              <div className="url-image">
                                <img
                                  src={urlMetadata[url].image}
                                  alt={urlMetadata[url].title}
                                />
                              </div>
                              <div className="url-title">
                                {urlMetadata[url].title}
                              </div>
                              <div className="url-description">
                                {urlMetadata[url].description}
                              </div>
                              <small className="url-origin">
                                {new URL(urlMetadata[url].url).origin}
                              </small>
                            </>
                          ) : (
                            <div className="url-placeholder">
                              <TranslationWrapper targetLanguage={preferredLanguage}>
                                Loading...
                              </TranslationWrapper>
                            </div>
                          )}
                        </a>
                      </div>
                    ))}
                </>
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
