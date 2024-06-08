import React from 'react';
import { languages } from '../utils/languages';
import CustomDropdown from './CustomDropdown';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { setLanguage } = useLanguage();
  const { language, content } = useLanguage();
  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  return (
    <CustomDropdown
      options={languages}
      onChange={handleLanguageChange}
      defaultOption={navigator.language}
      description={content["select-language"]}
      label={content["language"]}
      targetLanguage={language}
      content={{
        searchPlaceholder: content["search-language"],
        searchBarTip: content["searchbar-tip"],
        clearButtonText: content["clear-button-text"],
      }}
    />
  );
};

export default LanguageSelector;
