'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
});

function getMediaQueryList(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  try {
    const mediaQuery = window.matchMedia(query);
    return mediaQuery && typeof mediaQuery.matches === 'boolean' ? mediaQuery : null;
  } catch {
    return null;
  }
}

function getPreferredTheme(): Theme {
  if (getMediaQueryList('(prefers-color-scheme: dark)')?.matches) {
    return 'dark';
  }

  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const preferred = getPreferredTheme();
    const resolved = stored || preferred;
    setTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
