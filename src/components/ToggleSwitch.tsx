// ToggleSwitch.tsx
import React from "react";
import "../css/toggle-switch.css";
import TranslationWrapper from "./TranslationWrapper";

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  label?: string;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  className?: string;
  tooltip?: string;
  targetLanguage: any;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  label,
  onIcon,
  offIcon,
  className,
  tooltip,
  targetLanguage,
}) => {
  return (
    <div
      className={`toggle-switch-container ${className}`}
      data-tooltip={tooltip}
    >
      <label>
        <TranslationWrapper
          targetLanguage={targetLanguage}
          originalLanguage={navigator.language}
        >
          {label}
        </TranslationWrapper>
      </label>
      <div className="toggle-switch">
        <input
          checked={isOn}
          onChange={handleToggle}
          className="toggle-input"
          type="checkbox"
          id="toggle-switch"
        />
        <label className="toggle-label" htmlFor="toggle-switch">
          <span className="on-icon">{isOn ? onIcon : null}</span>
          <span className="toggle-button" />
          <span className="off-icon">{!isOn ? offIcon : null}</span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
