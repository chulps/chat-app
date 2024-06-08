import React, { useEffect, useState, ReactNode } from 'react';
import { translateText } from '../utils/translate';

interface TranslationWrapperProps {
  children: ReactNode;
  targetLanguage: string;
  originalLanguage: string;
}

const getTranslationFromLocalStorage = (key: string): string | null => {
  const storedTranslation = localStorage.getItem(key);
  return storedTranslation ? JSON.parse(storedTranslation) : null;
};

const setTranslationInLocalStorage = (key: string, translation: string) => {
  localStorage.setItem(key, JSON.stringify(translation));
};

const translationCache: { [key: string]: string } = {};

const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ children, targetLanguage, originalLanguage }) => {
  const [translatedContent, setTranslatedContent] = useState<ReactNode>(children);

  useEffect(() => {
    let isMounted = true;

    const translateContent = async () => {
      const text = typeof children === 'string'
        ? children
        : React.isValidElement(children) && typeof children.props.children === 'string'
          ? children.props.children
          : '';

      const cacheKey = `${text}-${targetLanguage}`;

      // Skip translation if original language matches target language
      if (originalLanguage === targetLanguage) {
        setTranslatedContent(children);
        return;
      }

      // Check localStorage for cached translation
      const localStorageTranslation = getTranslationFromLocalStorage(cacheKey);
      if (localStorageTranslation) {
        setTranslatedContent(localStorageTranslation);
        return;
      }

      // Use cached translation if available
      if (translationCache[cacheKey]) {
        setTranslatedContent(translationCache[cacheKey]);
        return;
      }

      if (typeof text === 'string') {
        const translation = await translateText(text, targetLanguage);
        if (isMounted) {
          translationCache[cacheKey] = translation;
          setTranslationInLocalStorage(cacheKey, translation); // Store in localStorage
          setTranslatedContent(translation);
        }
      } else {
        if (isMounted) {
          setTranslatedContent(children);
        }
      }
    };

    translateContent();

    return () => {
      isMounted = false;
    };
  }, [children, targetLanguage, originalLanguage]);

  return <>{translatedContent}</>;
};

export default TranslationWrapper;
