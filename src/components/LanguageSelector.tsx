import React from 'react';
import { languages } from '../utils/languages';
import CustomDropdown from './CustomDropdown';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { setLanguage } = useLanguage();

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  return (
    <CustomDropdown 
      options={languages} 
      onChange={handleLanguageChange} 
      defaultOption={navigator.language} 
      description="Select your preferred language"
      label="Language"
      targetLanguage="en"
      content={{ searchPlaceholder: "Search language...", searchBarTip: "Type to filter languages" }}
    />
  );
};

export default LanguageSelector;
