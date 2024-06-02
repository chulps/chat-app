interface EnvironmentConfig {
  socketUrl: string;
  translateUrl: string;
}

const environments: { [key: string]: EnvironmentConfig } = {
  local: {
    socketUrl: 'http://localhost:3001',
    translateUrl: 'http://localhost:3001',
  },
  production: {
    socketUrl: 'https://limitless-lake-38337.herokuapp.com',
    translateUrl: 'https://limitless-lake-38337.herokuapp.com',
  },
};

export const getEnv = (): EnvironmentConfig => {
  const isLocalhost = window.location.hostname === 'localhost';
  return isLocalhost ? environments.local : environments.production;
};
