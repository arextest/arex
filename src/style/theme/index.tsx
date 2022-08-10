// https://emotion.sh/docs/theming
import colorLib from '@kurkle/color';

export enum Theme {
  light = 'light',
  dark = 'dark',
}
export enum ThemeIcon {
  light = '🌞',
  dark = '🌛',
}

export const ThemeKey = 'theme';
export const DefaultTheme = Theme.light;

export const Color = {
  primaryColor: '#603BE3',
};

const themeDark = {
  color: {
    primary: '#955cf4',
    active: 'rgba(255, 255, 255, 0.08)',
    selected: colorLib('#955cf4').alpha(0.1).rgbString(),
    success: '#2e7d32',
    info: '#0288d1',
    warning: '#ed6c02',
    error: '#d32f2f',
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      watermark: 'rgba(255, 255, 255, 0.1)',
      highlight: '#955cf4',
    },
    border: {
      primary: '#303030',
    },
  },
};

const themeLight = {
  color: {
    primary: '#603BE3',
    active: '#f5f5f5',
    selected: colorLib('#603BE3').alpha(0.1).rgbString(),
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
      disabled: 'rgba(0,0,0,0.38)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: '#603BE3',
    },
    border: {
      primary: '#F0F0F0',
    },
  },
};

const themeMap = {
  [Theme.light]: themeLight,
  [Theme.dark]: themeDark,
};

export const themeCreator = (theme: Theme) => themeMap[theme];
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
