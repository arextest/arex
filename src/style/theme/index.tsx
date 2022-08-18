// https://emotion.sh/docs/theming
import { Theme as EmotionTheme } from '@emotion/react';

import DarkPurple from './darkPurple';
import DarkRed from './darkRed';
import LightPurple from './lightPurple';
import LightRed from './lightRed';

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
  lightPurple: LightPurple.name,
  darkPurple: DarkPurple.name,
  lightRed: LightRed.name,
  darkRed: DarkRed.name,
};

export const ThemeKey = 'theme';
export const DefaultTheme = Theme.lightPurple;

export const Color = {
  primaryColor: '#603BE3',
};

export const primaryColorPalette: { [themeName: string]: { key: string; name: ThemeName }[] } = {
  [ThemeClassify.dark]: [
    { key: DarkPurple.primaryColor, name: DarkPurple.name },
    { key: DarkRed.primaryColor, name: DarkRed.name },
  ],
  [ThemeClassify.light]: [
    { key: LightPurple.primaryColor, name: LightPurple.name },
    { key: LightRed.primaryColor, name: LightRed.name },
  ],
};

export const themeMap: { [themeName: string]: EmotionTheme } = {
  [Theme.lightPurple]: LightPurple.theme,
  [Theme.darkPurple]: DarkPurple.theme,
  [Theme.lightRed]: LightRed.theme,
  [Theme.darkRed]: DarkRed.theme,
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
