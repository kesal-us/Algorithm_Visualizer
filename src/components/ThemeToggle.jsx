// src/components/ThemeToggle.js
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.body.style.backgroundColor = dark ? '#121212' : '#ffffff';
    document.body.style.color = dark ? '#ffffff' : '#000000';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        backgroundColor: dark ? '#555' : '#ddd',
        color: dark ? '#fff' : '#000',
        padding: '6px 12px',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
      }}
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
