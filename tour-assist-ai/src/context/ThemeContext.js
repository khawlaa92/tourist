import React, { createContext, useState } from 'react';
import { lightTheme, darkTheme } from '../../constants/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, isDark: isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
