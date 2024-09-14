import React, { useState, useEffect, useCallback, useMemo } from "react";
import QRCodeMessage from "./QRCodeMessage";
import TranslationWrapper from "./TranslationWrapper";
import { getUrlMetadata } from "../utils/urlUtils";
import styled from "styled-components";
import moment from "moment";
import { Message as MessageType } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faCopy,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const OriginalText = styled.small`
  opacity: 0.25;
  border-top: 1px solid var(--white);
`;

const MessageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(---space-1);
  width: 100%;
  padding-inline: 0.5em;
`;

const ReactionMenu = styled.div<{ isCurrentUser: boolean }>`
  position: absolute;
  bottom: 100%;
  left: ${({ isCurrentUser }) =>
    isCurrentUser ? "auto" : "0"}; /* Align to the right if current user */
  right: ${({ isCurrentUser }) =>
    isCurrentUser ? "0" : "auto"}; /* Align to the left if not current user */
  display: flex;
  background-color: var(--dark);
  border-radius: 1em;
  overflow: hidden;
  border: 1px solid var(--neutral-800);

  span {
    background: var(--dark);
    aspect-ratio: 1/1;
    width: var(--space-3);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      filter: brightness(1.3);
    }
  }
`;

const ActionMenu = styled.div`
  position: relative;
  width: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--dark);
  border-radius: 1em;
  overflow: hidden;
  z-index: 1;
  border: 1px solid var(--secondary);

  span {
    padding: 0.5em 1em;
    background: var(--dark);
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      filter: brightness(1.3);
    }

    &.delete {
      color: var(--danger-300);
    }
  }
`;

const MessageText = styled.span`
  display: flex;
  width: 100%;
  margin: 0;
  flex-direction: column;
`;

const RepliedMessagePreview = styled.div`
  background-color: rgba(0,0,0,0.2);
  color: white;
  border-left: 3px solid rgba(255,255,255,0.5);
  padding: 0.25em 0.5em;
  margin-inline: -0.5em;
  margin-bottom: 0.25em;
  border-radius: 0.5em;
  font-size: 0.9em;

    small {
      color: rgba(255,255,255,0.5);
      &::before {
        content: "@"
      }
    }

    p {
      font-size: var(--font-size-small);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis

    }
`;

const ReactionsWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.25em 0.5em;
  margin-inline: -0.5em;

  border-radius: 0.5em;
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  margin-top: 0.25em;
  padding-top: 0.25em;
  width: fit-content;
`;

interface MessageListProps {
  messages: MessageType[];
  name: string;
  preferredLanguage: string;
  conversationContainerRef: React.RefObject<HTMLDivElement>;
  showOriginal: boolean;
  handleReaction: (messageId: string, emoji: string) => void;
  handleReply: (messageId: string) => void;
  handleEdit: (messageId: string, newText: string) => void;
  handleDelete: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  name,
  preferredLanguage,
  conversationContainerRef,
  showOriginal,
  handleReaction,
  handleReply,
  handleEdit,
  handleDelete,
}) => {
  const [urlMetadata, setUrlMetadata] = useState<{ [url: string]: any }>({});
  const [fetchedUrls, setFetchedUrls] = useState<Set<string>>(new Set());
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // New logic for fetching metadata
  const fetchMetadata = useCallback(async (urls: string[]) => {
    const newMetadata: { [url: string]: any } = {};

    for (const url of urls) {
      if (!fetchedUrls.has(url)) {
        try {
          const metadata = await getUrlMetadata(url);
          newMetadata[url] = metadata;
          setUrlMetadata((prevMetadata) => ({ ...prevMetadata, ...newMetadata }));
          setFetchedUrls((prev) => new Set(prev).add(url));
        } catch (error) {
          console.error(`Error fetching metadata for ${url}:`, error);
        }
      }
    }
  }, [fetchedUrls]);

  // Collect URLs from messages and trigger metadata fetching
  useEffect(() => {
    const allUrls: string[] = [];
    messages.forEach((message) => {
      const urls = message.text?.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
      );
      if (urls) {
        allUrls.push(...urls);
      }
    });
    if (allUrls.length > 0) {
      fetchMetadata(allUrls);
    }
  }, [messages, fetchMetadata]);

  /**
   * Renders a string of text with any email addresses or URLs detected as clickable links.
   *
   * @param text - The input text to be rendered with links.
   * @returns A React element containing the text with email and URL links.
   */
  const renderTextWithLinks = useCallback((text: string) => {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

    const parts = text.split(
      new RegExp(`(${emailRegex.source})|(${urlRegex.source})`, "g")
    );
    return parts.map((part, index) => {
      if (part) {
        if (part.match(emailRegex)) {
          return (
            <a
              key={index}
              target="_blank"
              rel="noreferrer"
              href={`mailto:${part}`}
              className="email-link"
            >
              {part}
            </a>
          );
        } else if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="url-link"
            >
              {part}
            </a>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      }
      return null;
    });
  }, []);

  const renderMessageContent = useCallback(
    (message: MessageType, isCurrentUser: boolean) => {
      const isEmail = message.text?.match(
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
      );
      const isUrl = message.text?.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
      );

      const repliedMessage = message.repliedTo
        ? messages.find((msg) => msg._id === message.repliedTo)
        : null;

      return (
        <div>
          {repliedMessage && (
            <RepliedMessagePreview>
              <small>{repliedMessage.sender}:</small>
              <p>{repliedMessage.text}</p>
            </RepliedMessagePreview>
          )}

          {message.type === "qr" && <QRCodeMessage url={message.text} />}
          {isEmail ? (
            renderTextWithLinks(message.text)
          ) : isUrl ? (
            <div>
              <div className="message-text">
                {renderTextWithLinks(message.text)}
              </div>
              {isUrl.map((url) => (
                <div key={url} className="url-metadata">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {urlMetadata[url] ? (
                      <>
                        <div className="url-image">
                          <img
                            loading="lazy"
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
                      <div className="url-placeholder">Loading...</div>
                    )}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <MessageText>
              <TranslationWrapper
                targetLanguage={preferredLanguage}
                originalLanguage={message.language}
              >
                {message.text}
              </TranslationWrapper>
              {showOriginal && !isCurrentUser && message.type !== "system" && (
                <OriginalText className="original-text">
                  {message.text}
                </OriginalText>
              )}
            </MessageText>
          )}

          {message.reactions && message.reactions.length > 0 && (
            <ReactionsWrapper>
              {message.reactions.map((reaction, idx) => (
                <small key={idx}>{reaction}</small>
              ))}
            </ReactionsWrapper>
          )}
        </div>
      );
    },
    [
      preferredLanguage,
      renderTextWithLinks,
      urlMetadata,
      showOriginal,
      messages,
    ]
  );

  const memoizedRenderMessageContent = useMemo(
    () => renderMessageContent,
    [renderMessageContent]
  );

  const handleMenuToggle = (messageId: string) => {
    if (selectedMessage === messageId) {
      setSelectedMessage(null);
    } else {
      setSelectedMessage(messageId);
    }
  };

  return (
    <div className="conversation-container" ref={conversationContainerRef}>
      {messages.map((message, index) => {
        const isCurrentUser = message.sender === name;
        const isMessageSelected = selectedMessage === message._id;

        return (
          <div className="message-row" key={index}>
            <div
              className={`message-wrapper ${isCurrentUser ? "me" : ""} ${
                message.type === "system" || message.type === "qr"
                  ? "system-message"
                  : ""
              }`}
              onClick={() => handleMenuToggle(message._id || "")}
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
                {memoizedRenderMessageContent(message, isCurrentUser)}
              </div>
              <MessageFooter>
                {message.edited && (
                  <small style={{ color: "var(--primary)" }}>(Edited)</small>
                )}
                {message.type !== "system" &&
                  message.type !== "qr" &&
                  message.timestamp && (
                    <small
                      style={{ color: "var(--neutral-400)" }}
                      className="timestamp"
                    >
                      {moment(message.timestamp).format("HH:mm")}
                    </small>
                  )}
              </MessageFooter>

              {isMessageSelected && (
                <>
                  <ReactionMenu isCurrentUser={isCurrentUser}>
                    <span
                      onClick={() => handleReaction(message._id || "", "👍")}
                    >
                      👍
                    </span>
                    <span
                      onClick={() => handleReaction(message._id || "", "👎")}
                    >
                      👎
                    </span>
                    <span
                      onClick={() => handleReaction(message._id || "", "❤️")}
                    >
                      ❤️
                    </span>
                    <span
                      onClick={() => handleReaction(message._id || "", "😂")}
                    >
                      😂
                    </span>
                    <span
                      onClick={() => handleReaction(message._id || "", "😮")}
                    >
                      😮
                    </span>
                  </ReactionMenu>

                  <ActionMenu>
                    <span onClick={() => handleReply(message._id || "")}>
                      <FontAwesomeIcon icon={faReply} />
                      &nbsp;&nbsp;Reply
                    </span>
                    <span
                      onClick={() =>
                        navigator.clipboard.writeText(message.text)
                      }
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      &nbsp;&nbsp;Copy
                    </span>

                    <hr />
                    {isCurrentUser && (
                      <>
                        <span
                          onClick={() =>
                            handleEdit(message._id || "", message.text)
                          }
                        >
                          <FontAwesomeIcon icon={faPen} />
                          &nbsp;&nbsp;Edit
                        </span>
                        <span
                          className="delete"
                          onClick={() => handleDelete(message._id || "")}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          &nbsp;&nbsp;Delete
                        </span>
                      </>
                    )}
                  </ActionMenu>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
