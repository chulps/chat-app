import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { subscribeUser } from './utils/subscribe'; // Adjust the import as needed

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const initializePushNotifications = async () => {
  const applicationServerKey = 'BF8O2sWTtQEjuN0z5Me4Eay0Se_MPuJjRsrurGwQuDgzKBtHf7hIe3ukSOU9cInU9-jLM8qOhuVF9lF1IP0KByI';
  try {
    const subscription = await subscribeUser(applicationServerKey);
    await fetch('http://localhost:3001/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    console.log('Push subscription successful.');
  } catch (error) {
    console.error('Push subscription failed:', error);
  }
};

initializePushNotifications();

root.render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
);
