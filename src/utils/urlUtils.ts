import axios from 'axios';
import { getEnv } from './getEnv';

const { translateUrl } = getEnv();

export const getUrlMetadata = async (url: string) => {
  try {
    const response = await axios.get(`${translateUrl}/api/url-metadata`, {
      params: { url }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching URL metadata:", error);
    return null;
  }
};
