'use client';

import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  // ✅ Initialize from localStorage (or default to 'light')
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('themeMode');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return 'light';
  });

  const toggleTheme = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next); // ✅ Save preference
      return next;
    });
  }, []);

  // ✅ Listen for changes in other tabs (cross-tab sync)
  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'themeMode' && (event.newValue === 'light' || event.newValue === 'dark')) {
        setMode(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
