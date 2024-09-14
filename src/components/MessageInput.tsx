import React, { useState, useEffect } from "react";
import AudioRecorder from "./AudioRecorder";
import { useLanguage } from "../contexts/LanguageContext";
import styled from "styled-components";
import { Message as MessageType } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowUp } from "@fortawesome/free-solid-svg-icons";

const RepliedMessageWrapper = styled.div`
  background-color: transparent;
  border-radius: 0.5em;
  margin-bottom: 0.5em;
  position: absolute;
  bottom: 100%;
  flex-grow: 1;
  border-left: 3px solid var(--secondary);
  backdrop-filter: blur(4px) brightness(0.4);
  margin-inline: 0.5em;
`;

const ReplyingToLabel = styled.small`
  color: var(--secondary);
  &::before {
    content: "@";
  }
`;

const RepliedMessageText = styled.small`
  padding: 0 1em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  backdrop-filter: blur(2px);
  z-index: 1;
`;

const RepliedTextHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em;
`;

const MessageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const MessageInputField = styled.input`
  border-radius: var(--space-2);
  border: none;
  outline: 1px solid var(--secondary);
  padding-right: var(--space-4);
  &:focus {
    outline: 2px solid var(--primary);
    transform: unset;
  }
`;

const CancelReplyButton = styled.button`
  background: transparent;
  padding: 0;
  border-radius: var(--space-0);
  aspect-ratio: 1/1;
  height: 1.5em;

  &:hover {
    background: var(--dark);
    filter: brightness(1.3);
  }
`;

const CancelEditButton = styled.button`
  background: var(--danger-300);
  border: none;
  color: white;
  border-radius: var(--space-2);
  padding: 0.5em 1em;
  margin-bottom: 0.5em;

  &:hover {
    background: var(--danger-500);
  }
`;

const EditingInputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
  position: absolute;
  bottom: 100%;
`;

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (messageText?: string) => void;
  handleEditMessage: (messageId: string, newText: string) => void; // New prop for editing
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isNamePromptVisible: boolean;
  onStopRecording: (blob: Blob) => void;
  repliedMessage: MessageType | null;
  setRepliedMessage: React.Dispatch<React.SetStateAction<MessageType | null>>;
  isEditing: boolean;
  editingMessageId: string | null; // Track which message is being edited
  cancelEdit: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  handleEditMessage, // New handler for editing
  handleKeyPress,
  isNamePromptVisible,
  onStopRecording,
  repliedMessage,
  setRepliedMessage,
  isEditing,
  editingMessageId,
  cancelEdit,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { content } = useLanguage();

  useEffect(() => {
    if (!isEditing) {
      setInputMessage(""); // Clear the input field when not editing
    }
  }, [isEditing, setInputMessage]);

  return (
    <MessageInputContainer>
      {isEditing && (
        <EditingInputHeader>
          <CancelEditButton onClick={cancelEdit}>Cancel Edit</CancelEditButton>
        </EditingInputHeader>
      )}
      {repliedMessage && !isEditing && (
        <RepliedMessageWrapper>
          <RepliedTextHeader>
            <ReplyingToLabel>{repliedMessage.sender}</ReplyingToLabel>
            <CancelReplyButton onClick={() => setRepliedMessage(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </CancelReplyButton>
          </RepliedTextHeader>
          <RepliedMessageText>{repliedMessage.text}</RepliedMessageText>
        </RepliedMessageWrapper>
      )}
      <MessageInputField
        id="message-input"
        type="text"
        value={inputMessage}
        placeholder={
          isEditing ? "Edit your message..." : content["placeholder-message"]
        }
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isNamePromptVisible}
      />
      <div className="message-input-buttons">
        {inputMessage && (
          <button
            style={{ padding: "1em 1.25em" }}
            onClick={() =>
              isEditing && editingMessageId
                ? handleEditMessage(editingMessageId, inputMessage) // Call edit function when editing
                : sendMessage()
            }
            disabled={isNamePromptVisible}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        )}
        {!inputMessage && (
          <AudioRecorder
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            onStopRecording={onStopRecording}
          />
        )}
      </div>
    </MessageInputContainer>
  );
};

export default MessageInput;
