import { useEffect, useState } from 'react';

export const themeModes = ['auto', 'light', 'dark'];
const themeStorageKey = 'zenmind:theme';

function resolveTheme(mode) {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeMode(mode) {
  const nextMode = themeModes.includes(mode) ? mode : 'auto';
  const resolvedTheme = resolveTheme(nextMode);
  const root = document.documentElement;
  root.dataset.themeMode = nextMode;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', resolvedTheme === 'dark' ? '#08090c' : '#f7f7f4');
  }
}

function readStoredThemeMode() {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    const current = document.documentElement.dataset.themeMode || stored;
    return themeModes.includes(current) ? current : 'auto';
  } catch {
    const current = document.documentElement.dataset.themeMode;
    return themeModes.includes(current) ? current : 'auto';
  }
}

function writeStoredThemeMode(mode) {
  try {
    window.localStorage.setItem(themeStorageKey, mode);
  } catch {
    // Theme still applies through documentElement dataset when storage is unavailable.
  }
}

export function useThemeMode() {
  const [mode, setModeState] = useState(readStoredThemeMode);

  useEffect(() => {
    applyThemeMode(mode);
    writeStoredThemeMode(mode);
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (mode === 'auto') {
        applyThemeMode('auto');
      }
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [mode]);

  return { mode, setMode: setModeState };
}
