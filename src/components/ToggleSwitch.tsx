import React from "react";
import styled from "styled-components";
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
  onIconColor?: string;
  offIconColor?: string;
  onBackgroundColor?: string;
  offBackgroundColor?: string;
}

const ToggleSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  height: fit-content;
`;

const ToggleSwitchWrapper = styled.div<{ onBackgroundColor: string; offBackgroundColor: string; isOn: boolean }>`
  position: relative;
  display: inline-block;
  width: calc(var(--space-3) + var(--space-2));
  height: calc(var(--space-2) + var(--space-1));
  background-color: ${(props) => (props.isOn ? props.onBackgroundColor : props.offBackgroundColor)};
  border-radius: var(--space-3);
  transition: background-color 0.3s;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  border-radius: var(--space-3);
  outline: 1px solid var(--secondary);
  display: flex;
  align-items: center;
`;

const ToggleLabelBefore = styled.span`
  content: "";
  position: absolute;
  left: var(--space-0);
  top: var(--space-0);
  width: var(--space-2);
  height: var(--space-2);
  background-color: var(--white);
  border-radius: 50%;
  transition: transform 0.2s;
  `;
  
  const ToggleIcon = styled.span<{ iconColor: string }>`
  font-size: var(--font-size-h5);
  position: absolute;
  color: ${(props) => props.iconColor};
`;

const OnIcon = styled(ToggleIcon)`
  left: var(--space-1);
`;

const OffIcon = styled(ToggleIcon)`
  right: var(--space-1);
`;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  label,
  onIcon,
  offIcon,
  className,
  tooltip,
  targetLanguage,
  onIconColor = '#fff',
  offIconColor = '#fff',
  onBackgroundColor = '#4CAF50',
  offBackgroundColor = '#ccc'
}) => {
  return (
    <ToggleSwitchContainer className={className} data-tooltip={tooltip}>
      {label && (
        <label>
          <TranslationWrapper
            targetLanguage={targetLanguage}
            originalLanguage={navigator.language}
          >
            {label}
          </TranslationWrapper>
        </label>
      )}
      <ToggleSwitchWrapper
        isOn={isOn}
        onBackgroundColor={onBackgroundColor}
        offBackgroundColor={offBackgroundColor}
      >
        <ToggleInput
          checked={isOn}
          onChange={handleToggle}
          type="checkbox"
          id="toggle-switch"
        />
        <ToggleLabel htmlFor="toggle-switch">
          <OnIcon iconColor={onIconColor}>{isOn ? onIcon : null}</OnIcon>
          <ToggleLabelBefore style={{ transform: isOn ? 'translateX(calc(var(--space-2) + var(--space-1)))' : 'none' }} />
          <OffIcon iconColor={offIconColor}>{!isOn ? offIcon : null}</OffIcon>
        </ToggleLabel>
      </ToggleSwitchWrapper>
    </ToggleSwitchContainer>
  );
};

export default ToggleSwitch;
