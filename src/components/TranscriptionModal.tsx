import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface TranscriptionModalProps {
    transcriptionText: string;
    setTranscriptionText: React.Dispatch<React.SetStateAction<string | null>>;
    onConfirm: () => void;
    onCancel: () => void;
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
    transcriptionText,
    setTranscriptionText,
    onConfirm,
    onCancel,
    setIsRecording,
}) => {
    const [editedText, setEditedText] = useState(transcriptionText);
    const { content } = useLanguage(); // Use 'content' instead of 'defaultContent'
    
  return (
    <div className="transcription-modal">
      <div className="transcription-modal-content">
        <label>{content["tap-to-edit"]}</label> {/* Updated to use content for the label */}
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <div className="transcription-modal-buttons">
          <button style={{background: 'transparent', color: 'var(--danger-400'}} onClick={() => { onCancel(); setIsRecording(false); }}>
            {content["cancel"]} {/* Updated to use content for the button */}
          </button>
          <button onClick={() => { setTranscriptionText(editedText); onConfirm(); }}>
            {content["send"]} {/* Updated to use content for the button */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionModal;
