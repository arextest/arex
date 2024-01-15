import { Theme as ArexTheme } from '@arextest/arex-core';
import { useEffect, useState } from 'react';

import { getThemeByDark, SYSTEM_THEME, Theme } from '@/constant';
import { useUserProfile } from '@/store';

const useDarkMode = () => {
  const { theme: _theme } = useUserProfile();
  const [systemDarkTheme, setSystemDarkTheme] = useState(SYSTEM_THEME);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent) => {
      setSystemDarkTheme(getThemeByDark(e.matches));
    };
    darkModeMediaQuery.addEventListener('change', updateTheme);
    return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return _theme === Theme.system ? systemDarkTheme === ArexTheme.dark : _theme === Theme.dark;
};

export default useDarkMode;
