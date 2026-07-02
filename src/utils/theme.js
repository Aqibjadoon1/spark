const STORAGE_KEY = 'spark-theme';

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === THEME.LIGHT || stored === THEME.DARK) return stored;
  } catch {}
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEME.DARK : THEME.LIGHT;
  } catch {}
  return THEME.DARK;
};

export const persistTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
};

export const applyThemeClass = (theme) => {
  document.documentElement.classList.remove(THEME.LIGHT, THEME.DARK);
  document.documentElement.classList.add(theme);
};
