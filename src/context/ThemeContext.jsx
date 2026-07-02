import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getInitialTheme, persistTheme, applyThemeClass } from '../utils/theme';
import { THEME } from '../utils/theme';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeClass(theme);
    persistTheme(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === THEME.LIGHT || newTheme === THEME.DARK) {
      setThemeState(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === THEME.DARK ? THEME.LIGHT : THEME.DARK));
  }, []);

  const isDark = theme === THEME.DARK;
  const isLight = theme === THEME.LIGHT;

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme, isDark, isLight }),
    [theme, toggleTheme, setTheme, isDark, isLight],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
