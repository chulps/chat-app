// src/components/Header.tsx
import React from 'react';
import LanguageSelector from './LanguageSelector';
import '../css/header.css';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Babel Chat</h1>
      <LanguageSelector />
    </header>
  );
};

export default Header;
