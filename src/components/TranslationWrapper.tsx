import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translate';

interface TranslationWrapperProps {
  children: string;
  targetLanguage: string;
  sourceLanguage: string;
}

const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ children, targetLanguage, sourceLanguage }) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(children);

  useEffect(() => {
    const translateText = async () => {
      if (sourceLanguage !== targetLanguage) {
        const translated = await translate(children, targetLanguage, sourceLanguage);
        setTranslatedText(translated);
      } else {
        setTranslatedText(children);
      }
    };
    translateText();
  }, [children, targetLanguage, sourceLanguage]);

  return <span>{translatedText}</span>;
};

export default TranslationWrapper;
