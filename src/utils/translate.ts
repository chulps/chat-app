// src/utils/translate.ts
import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://limitless-lake-38337.herokuapp.com'
  : 'http://localhost:3001';

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (targetLanguage === 'en' || targetLanguage === 'en-US') {
    return text;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/translate`, {
      text,
      targetLanguage,
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return the original text if translation fails
  }
};
