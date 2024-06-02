import axios from 'axios';
import { getEnv } from './getEnv';

const { translateUrl } = getEnv();

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await axios.post(`${translateUrl}/api/translate`, { text, targetLanguage });
    return response.data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
};
