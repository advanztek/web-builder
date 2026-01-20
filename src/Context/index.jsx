import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../Theme';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const mode = 'dark'; // 🔒 Locked to dark mode

  // Persist dark mode in case browser or other code tries to override
  useEffect(() => {
    localStorage.setItem('themeMode', 'dark');
  }, []);

  const theme = useMemo(() => getTheme('dark'), []);

  const value = {
    mode,
    theme,
    toggleTheme: () => {}, // 🚫 Disabled — dark mode only
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
