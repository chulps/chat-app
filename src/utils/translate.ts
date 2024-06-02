import axios from 'axios';
import getEnv from './getEnv';

const currentEnv = getEnv();
const baseUrl = currentEnv === 'production'
  ? 'https://limitless-lake-38337.herokuapp.com' || 'http://192.168.40.215:3000/chat-app'
  : 'http://localhost:3001';

export const translateText = async (text: string, targetLanguage: string) => {
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
