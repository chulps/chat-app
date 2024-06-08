import React, { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { defaultContent } from "../contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isNamePromptVisible: boolean;
  onStopRecording: (blob: Blob) => void; // Add this prop
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
          <button onClick={sendMessage} disabled={isNamePromptVisible}>
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
