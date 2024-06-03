import axios from 'axios';
import { getEnv } from '../utils/getEnv';

const { translateUrl } = getEnv();

interface TranslateResponse {
  translatedText: string;
}

export const translate = async (text: string, targetLanguage: string, sourceLanguage: string): Promise<string> => {
  // Skip translation if source and target languages are the same
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  try {
    const response = await axios.post<TranslateResponse>(`${translateUrl}/api/translate`, {
      text,
      targetLanguage,
    });

    return response.data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return the original text in case of error
  }
};
