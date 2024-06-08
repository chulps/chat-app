import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import WaveComponent from "./WaveComponent";

interface AudioRecorderProps {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  onStopRecording: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  setIsRecording,
  onStopRecording,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser");
      alert("Your browser does not support audio recording. Please use a modern browser.");
      return;
    }

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
    }).catch((error) => {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check your browser settings.");
      setIsRecording(false);
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
        className={`secondary ${isRecording ? "blink" : ""}`}
        style={{
          color: isRecording ? "white" : "var(--danger-400)",
          padding: "1em 1.25em",
          backgroundColor: isRecording
            ? "var(--danger-500)"
            : "var(--secondary)",
        }}
        onClick={isRecording ? stopRecording : startRecording}
      >
          <FontAwesomeIcon icon={faMicrophone} />
      </button>
    </div>
  );
};

export default AudioRecorder;
