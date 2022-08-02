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
    active: '#f5f5f5',
    selected: colorLib('#955cf4').alpha(0.1).rgbString(),
    text: {
      primary: '#000000D9',
      secondary: '#000000D9',
      disabled: '#000000D9',
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
    text: {
      primary: '#000000D9',
      secondary: '#000000D9',
      disabled: '#000000D9',
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
      text: {
        primary: string;
        secondary: string;
        disabled: string;
        highlight: string;
      };
      border: {
        primary: string;
      };
    };
  }
}
