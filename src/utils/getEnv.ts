const environments: { [key: string]: { socketUrl: string; transcribeApiUrl: string; translateUrl: string } } = {
  local: {
    socketUrl: 'http://localhost:3001',
    translateUrl: 'http://localhost:3001',
    transcribeApiUrl: 'http://localhost:3001', // Add this line
  },
  production: {
    socketUrl: 'https://limitless-lake-38337.herokuapp.com',
    translateUrl: 'https://limitless-lake-38337.herokuapp.com',
    transcribeApiUrl: 'https://limitless-lake-38337.herokuapp.com', // Add this line
  },
};

export const getEnv = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  return isLocalhost ? environments.local : environments.production;
};