// https://emotion.sh/docs/theming
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import colorLib from '@kurkle/color';
import { ConfigProvider } from 'antd';
import { FC, PropsWithChildren, useEffect } from 'react';

export enum Theme {
  light = 'light',
  dark = 'dark',
}
export enum ThemeIcon {
  light = '🌞',
  dark = '🌛',
}

export const DefaultTheme = Theme.light;

export const Color = {
  primaryColor: '#603BE3',
};

const themeDark = {
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
  },
};

const themeMap = {
  [Theme.light]: themeDark,
  [Theme.dark]: themeLight,
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
    };
  }
}

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const theme = themeCreator(Theme.light); // TODO theme support

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: theme.color.primary,
      },
    });
  }, [theme]);
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
};

export default ThemeProvider;
