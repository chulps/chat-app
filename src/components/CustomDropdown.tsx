// src/components/CustomDropdown.tsx
import React, { useState, useEffect, useRef } from "react";
import "../css/custom-dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface Option {
  value: string;
  label: string;
  keywords: string[];
}

interface CustomDropdownProps {
  options: Option[];
  onChange: (value: string) => void;
  defaultOption: string;
  description?: string;
  label?: string;
  targetLanguage: string;
  content: {
    searchPlaceholder: string;
    searchBarTip: string;
    clearButtonText: string;
  };
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  onChange,
  defaultOption,
  description,
  label,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(value) ||
          option.keywords.some((keyword) =>
            keyword.toLowerCase().includes(value)
          )
      )
    );
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

  const selectedOptionLabel = options.find(
    (option) => option.value === selectedOption
  )?.label;

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="custom-dropdown-selected" onClick={toggleDropdown}>
        <span className="selected-label">{selectedOptionLabel}</span>
        <span className="icon">
          {isOpen ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </span>
      </div>
      {isOpen && (
        <div className="custom-dropdown-options-container">
          <div className="custom-dropdown-search">
            <div className="menu-header">
              {label && <label htmlFor="search-input">{label}</label>}

              {searchTerm ? (
                <small className="system-message info">
                  {content.searchBarTip}
                </small>
              ) : null}
            </div>
            <div className="language-search-input-container">
              <input
                id="search-input"
                type="text"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === "Backspace") {
                    setSearchTerm("");
                  }
                }}
              />
              {searchTerm !== "" && (
                <button
                  className="small secondary language-search-clear-button"
                  onClick={() => setSearchTerm("")}
                >
                    {content.clearButtonText}
                </button>
              )}
            </div>{" "}
            {description && <p>{description}</p>}
            <hr />
          </div>
          <div className="custom-dropdown-options">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="custom-dropdown-option"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
