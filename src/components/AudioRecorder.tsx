import React, { useRef } from "react";
// import fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import WaveComponent from "./WaveComponent";
interface AudioRecorderProps {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  onStopRecording: (blob: Blob) => void; // Add this prop
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  setIsRecording,
  onStopRecording,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onStopRecording(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        mediaRecorderRef.current = null;
      };
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="audio-recorder">
      <button
        className="secondary"
        style={{
          color: "var(--danger-400",
          padding: "1em 1.25em",
          backgroundColor: isRecording
            ? "var(--danger-500)"
            : "var(--secondary)",
        }}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <WaveComponent />
        ) : (
          <FontAwesomeIcon icon={faMicrophone} />
        )}
      </button>
    </div>
  );
};

export default AudioRecorder;
