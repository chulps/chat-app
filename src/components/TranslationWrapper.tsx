import React, { useEffect, useState, ReactNode } from 'react';
import { translateText } from '../utils/translate';

interface TranslationWrapperProps {
  children: ReactNode;
  targetLanguage: string;
}

const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ children, targetLanguage }) => {
  const [translatedContent, setTranslatedContent] = useState<ReactNode>(children);

  useEffect(() => {
    const translateContent = async () => {
      if (typeof children === 'string') {
        const translation = await translateText(children, targetLanguage);
        setTranslatedContent(translation);
      } else if (
        React.isValidElement(children) &&
        typeof children.props.children === 'string'
      ) {
        const translation = await translateText(
          children.props.children,
          targetLanguage
        );
        setTranslatedContent(
          React.cloneElement(children, {
            ...children.props,
            children: translation,
          })
        );
      }
    };

    translateContent();
  }, [children, targetLanguage]);

  return <>{translatedContent}</>;
};

export default TranslationWrapper;
