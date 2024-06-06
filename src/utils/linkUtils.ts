// src/utils/linkUtils.ts
export const detectLinks = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.match(urlPattern) || [];
  };
  