import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/name-prompt.css";
import TranslationWrapper from "./TranslationWrapper";

interface NamePromptProps {
  onSubmit: (name: string) => void;
}

const NamePrompt: React.FC<NamePromptProps> = ({ onSubmit }) => {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const { content } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="name-prompt-overlay">
      <div className="name-prompt-container">
        <h3>T-Chat</h3>
        <p>
          <TranslationWrapper targetLanguage={language}>
            Enter Your Name
          </TranslationWrapper>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={content["placeholder-name"]}
          />
          <button type="submit">{content["submit"]}</button>
        </form>
      </div>
    </div>
  );
};

export default NamePrompt;
