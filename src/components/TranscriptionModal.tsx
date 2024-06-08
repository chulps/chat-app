import React, { useState } from "react";
import { defaultContent } from "../contexts/LanguageContext";

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

  return (
    <div className="transcription-modal">
      <div className="transcription-modal-content">
        <label>Tap to edit</label>
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <div className="transcription-modal-buttons">
          <button style={{background: 'transparent', color: 'var(--danger-400'}} onClick={() => { onCancel(); setIsRecording(false); }}>
            {defaultContent["cancel"]}
          </button>
          <button onClick={() => { setTranscriptionText(editedText); onConfirm(); }}>
            {defaultContent["send"]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionModal;
