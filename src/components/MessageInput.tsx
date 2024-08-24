import React, { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { useLanguage } from "../contexts/LanguageContext";
import styled from "styled-components";
import { Message as MessageType } from "../types"; // Correct import path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowUp } from "@fortawesome/free-solid-svg-icons";

const RepliedMessageWrapper = styled.div`
  background-color: transparent;
  border-radius: 1em;
  margin-bottom: 0.5em;
  position: absolute;
  bottom: 100%;
  width: fit-content;
  max-width: 80%;
`;

const ReplyingToLabel = styled.small`
  color: var(--secondary);

  &::before {
    content: "@";
  }
`;

const RepliedMessageText = styled.small`
  border: 1px solid var(--primary);
  color: var(--royal-300);
  padding: 0.25em 0.5em;
  border-radius: 1em;
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
  padding: 0.25em 0.5em;
  `

const MessageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
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
`

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (messageText?: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isNamePromptVisible: boolean;
  onStopRecording: (blob: Blob) => void;
  repliedMessage: MessageType | null; // Update to use MessageType
  setRepliedMessage: React.Dispatch<React.SetStateAction<MessageType | null>>; // Update to use MessageType
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  handleKeyPress,
  isNamePromptVisible,
  onStopRecording,
  repliedMessage,
  setRepliedMessage, // Function to clear repliedMessage
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const { content } = useLanguage();

  return (
    <MessageInputContainer>
{repliedMessage && (
  <RepliedMessageWrapper>
    <RepliedTextHeader>
      <ReplyingToLabel>{repliedMessage.sender} </ReplyingToLabel>
      <CancelReplyButton onClick={() => setRepliedMessage(null)}>
        <FontAwesomeIcon icon={faTimes} />
      </CancelReplyButton>
    </RepliedTextHeader>
    <RepliedMessageText>{repliedMessage.text}</RepliedMessageText>
  </RepliedMessageWrapper>
)}
      <MessageInputField
        type="text"
        value={inputMessage}
        placeholder={
          isRecording
            ? content["stop-recording"]
            : content["placeholder-message"]
        }
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isNamePromptVisible}
        className={isRecording ? "recording" : ""}
      />
      <div className="message-input-buttons">
        {inputMessage && (
          <button
            style={{ padding: "1em 1.25em" }}
            onClick={() => sendMessage()}
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
