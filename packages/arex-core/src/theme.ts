import { AliasToken } from 'antd/es/theme/interface';

export type DarkMode = boolean;
export type CompactMode = boolean;

export enum Theme {
  dark = 'dark',
  light = 'light',
  system = 'system',
}

export enum ColorPrimary {
  red = 'red',
  orange = 'orange',
  yellow = 'yellow',
  green = 'green',
  blue = 'blue',
  purple = 'purple',
  stone = 'stone',
}

export type ColorPrimaryPalette = { key: string; name: ColorPrimary };
export const colorPrimaryPalette: ColorPrimaryPalette[] = [
  { key: '#dc2626', name: ColorPrimary.red },
  { key: '#f97316', name: ColorPrimary.orange },
  { key: '#ca8a04', name: ColorPrimary.yellow },
  { key: '#65a30d', name: ColorPrimary.green },
  { key: '#2563eb', name: ColorPrimary.blue },
  { key: '#955cf4', name: ColorPrimary.purple },
  { key: '#a8a29e', name: ColorPrimary.stone },
];

export const lightToken: Partial<AliasToken> = {
  colorPrimary: '#955cf4',
  colorSuccess: '#66bb6a',
  colorInfo: '#29b6f6',
  colorWarning: '#ffa726',
  colorError: '#f44336',
  colorBgLayout: '#fff',
  colorTextBase: '#000000d9',
};

export const darkToken: Partial<AliasToken> = {
  colorPrimary: '#955cf4',
  colorSuccess: '#66bb6a',
  colorInfo: '#29b6f6',
  colorWarning: '#ffa726',
  colorError: '#f44336',
  colorBgLayout: '#202020',
  colorTextBase: '#ffffffd9',
};

export const tokenMap = {
  [Theme.light]: lightToken,
  [Theme.dark]: darkToken,
};

export const generateToken = (theme: Theme, colorPrimary?: ColorPrimary): Partial<AliasToken> => {
  const primary = colorPrimaryPalette.find((color) => color.name === colorPrimary)?.key;
  if (primary)
    return {
      ...tokenMap[theme],
      colorPrimary: primary,
      colorLink: primary,
      colorLinkActive: primary,
    };
  else return tokenMap[Theme.light];
};
