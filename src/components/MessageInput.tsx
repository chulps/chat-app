import React, { KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  isNamePromptVisible: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  handleKeyPress,
  isNamePromptVisible
}) => {
  return (
    <div className="message-input-container">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message"
        disabled={isNamePromptVisible}
      />
      <button
        className={`message-send-button ${
          inputMessage === "" ? "disabled" : ""
        }`}
        onClick={sendMessage}
        disabled={inputMessage === "" || isNamePromptVisible}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
};

export default MessageInput;
