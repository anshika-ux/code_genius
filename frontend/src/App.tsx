import React, { useState, useEffect } from 'react';
import './App.css';
import { MainRoutes } from './Routes/MainRoutes';
import { NavBar } from './Components/NavBar';

function App() {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <div className="App">
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <MainRoutes />
    </div>
  );
}

export default App;
