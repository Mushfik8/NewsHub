'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'normal' | 'large' | 'xlarge';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {},
  fontSize: 'normal',
  setFontSize: () => {},
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

const FONT_SIZE_CLASS_MAP: Record<FontSize, string> = {
  normal: '',
  large: 'font-large',
  xlarge: 'font-xlarge',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');

  useEffect(() => {
    // Restore theme
    const stored = localStorage.getItem('theme') as Theme | null;
    const preferred = getPreferredTheme();
    const resolved = stored || preferred;
    setTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');

    // Restore font size
    const storedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    if (storedFontSize && storedFontSize in FONT_SIZE_CLASS_MAP) {
      setFontSizeState(storedFontSize);
      applyFontSize(storedFontSize);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const applyFontSize = (size: FontSize) => {
    // Remove all font size classes first
    document.documentElement.classList.remove('font-large', 'font-xlarge');
    // Apply the new class
    const className = FONT_SIZE_CLASS_MAP[size];
    if (className) {
      document.documentElement.classList.add(className);
    }
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
    applyFontSize(size);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
