import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const className = 'dark-mode';
    if (dark) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
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
        cursor: 'pointer',
        marginBottom: '10px'
      }}
    >
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
