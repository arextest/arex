// https://emotion.sh/docs/theming
import { Theme as EmotionTheme } from '@emotion/react';

import darkPurple from './darkPurple';
import darkRed from './darkRed';
import lightPurple from './lightPurple';
import lightRed from './lightRed';

export enum ThemeClassify {
  light = 'light',
  dark = 'dark',
}
export enum PrimaryColor {
  purple = 'purple',
  red = 'red',
}
export const DefaultThemeClassify = ThemeClassify.light;
export type ThemeName = `${ThemeClassify}-${PrimaryColor}`;
export const Theme: { [theme: string]: ThemeName } = {
  lightPurple: 'light-purple',
  darkPurple: 'dark-purple',
  lightRed: 'light-red',
  darkRed: 'dark-red',
};

export const ThemeKey = 'theme';
export const DefaultTheme = Theme.lightPurple;

export const Color = {
  primaryColor: '#603BE3',
};

export const primaryColorPalette: { [themeName: string]: { key: string; name: ThemeName }[] } = {
  [ThemeClassify.dark]: [
    { key: '#955cf4', name: 'dark-purple' },
    { key: '#ff4d4f', name: 'dark-red' },
  ],
  [ThemeClassify.light]: [
    { key: '#603be3', name: 'light-purple' },
    { key: '#cf1322', name: 'light-red' },
  ],
};

export const themeMap: { [themeName: string]: EmotionTheme } = {
  [Theme.lightPurple]: lightPurple,
  [Theme.darkPurple]: darkPurple,
  [Theme.lightRed]: lightRed,
  [Theme.darkRed]: darkRed,
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
