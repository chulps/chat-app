import React from "react";

interface TypingIndicatorProps {
  typingUser: string | null;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUser }) => {
  return (
    <div className="typing-indicator-container">
      {typingUser && (
        <div className="typing-notification">{typingUser} is typing...</div>
      )}
    </div>
  );
};

export default TypingIndicator;
