import React from "react";

const ThemeContext = React.createContext<{ theme: string; setTheme: (t: string) => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  const setTheme = React.useCallback((next: string) => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeState(next);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => React.useContext(ThemeContext)!;
