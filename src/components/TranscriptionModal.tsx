import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface TranscriptionModalProps {
  transcriptionText: string;
  setTranscriptionText: React.Dispatch<React.SetStateAction<string | null>>;
  onConfirm: (editedText: string) => void;
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
  const { content } = useLanguage();

  useEffect(() => {
    setEditedText(transcriptionText);
    console.log("Transcription text updated:", transcriptionText);
  }, [transcriptionText]);

  const handleConfirm = () => {
    console.log("Confirm button clicked. Edited text:", editedText);
    onConfirm(editedText);
  };

  return (
    <div className="transcription-modal">
      <div className="transcription-modal-content">
        <label>{content["tap-to-edit"]}</label>
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <div className="transcription-modal-buttons">
          <button
            style={{ background: "transparent", color: "var(--danger-400" }}
            onClick={() => {
              onCancel();
              setIsRecording(false);
            }}
          >
            {content["cancel"]}
          </button>
          <button onClick={handleConfirm}>
            {content["send"]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionModal;
