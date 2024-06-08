import React, { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { defaultContent } from "../contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (messageText?: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isNamePromptVisible: boolean;
  onStopRecording: (blob: Blob) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  handleKeyPress,
  isNamePromptVisible,
  onStopRecording,
}) => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="message-input">
      <input
        type="text"
        value={inputMessage}
        placeholder={defaultContent["placeholder-message"]}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isNamePromptVisible}
      />
      <div className="message-input-buttons">
        {inputMessage && (
          <button style={{padding: '1em 1.25em'}} onClick={() => sendMessage()} disabled={isNamePromptVisible}>
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
    </div>
  );
};

export default MessageInput;
