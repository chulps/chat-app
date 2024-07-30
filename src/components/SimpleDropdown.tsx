import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface Option {
  value: string;
  label: string;
}

interface SimpleDropdownProps {
  options: Option[];
  onChange: (value: string) => void;
  defaultOption: string;
}

const DropdownContainer = styled.div`
  position: relative;
  width: fit-content;
  max-width: calc(var(--space-5) + var(--space-2));
  padding: 0.7em 1em;
  background-color: inherit;
  outline: 1px solid var(--secondary);
  outline-offset: -1px;
  border-radius: 1em;
  cursor: pointer;
  font-size: var(--font-size-default);
`;

const DropdownSelected = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;

  .icon {
    position: absolute;
    right: 0;
  }

  .selected-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 14ch;
    margin-inline-end: var(--space-3);
  }
`;

const DropdownOptionsContainer = styled.div`
  position: absolute;
  top: calc(100% + 1em);
  left: 0;
  background-color: var(--dark);
  width: fit-content;
  max-width: var(--space-7);
  max-height: var(--space-6);
  right: 0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;
  border-radius: 1em;
  overflow-x: hidden;
  overflow-y: auto;
  overflow-y: overlay;
`;

const DropdownOptions = styled.div`
  gap: var(--space-1);
`;

const DropdownOption = styled.div`
  padding: 1em 2em;
  cursor: pointer;
  transition: 0.3s ease-out;
  width: 100%;
  white-space: nowrap;

  &:hover {
    background-color: var(--neutral-800);
    transition: none;
  }
`;

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  options,
  onChange,
  defaultOption
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  const selectedOptionLabel = options.find(
    (option) => option.value === selectedOption
  )?.label;

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownSelected onClick={toggleDropdown}>
        <span className="selected-label">{selectedOptionLabel}</span>
        <span className="icon">
          {isOpen ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </span>
      </DropdownSelected>
      {isOpen && (
        <DropdownOptionsContainer>
          <DropdownOptions>
            {options.map((option) => (
              <DropdownOption
                key={option.value}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </DropdownOption>
            ))}
          </DropdownOptions>
        </DropdownOptionsContainer>
      )}
    </DropdownContainer>
  );
};

export default SimpleDropdown;
