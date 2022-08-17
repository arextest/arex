// https://emotion.sh/docs/theming
import { Theme as EmotionTheme, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { FC, ReactNode, useEffect, useMemo } from 'react';

import { useStore } from '../../store';
import themeDark from './dark';
import themeLight from './light';

export enum Theme {
  light = 'light',
  dark = 'dark',
}

export const ThemeKey = 'theme';
export const DefaultTheme = Theme.light;

export const Color = {
  primaryColor: '#603BE3',
};

export const themeMap = {
  [Theme.light]: themeLight,
  [Theme.dark]: themeDark,
};

// https://emotion.sh/docs/typescript#define-a-theme
declare module '@emotion/react' {
  export interface Theme {
    color: {
      primary: string;
      active: string;
      selected: string;
      success: string;
      info: string;
      warning: string;
      error: string;
      text: {
        primary: string;
        secondary: string;
        disabled: string;
        watermark: string;
        highlight: string;
      };
      border: {
        primary: string;
      };
    };
  }
}
