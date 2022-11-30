import { AliasToken } from 'antd/es/theme/interface';

export type DarkMode = boolean;
export type CompactMode = boolean;

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export enum ColorPrimary {
  purple = 'purple',
  red = 'red',
  green = 'green',
}

export type ColorPrimaryPalette = { key: string; name: ColorPrimary };
export const colorPrimaryPalette: ColorPrimaryPalette[] = [
  { key: '#955cf4', name: ColorPrimary.purple },
  { key: '#ff4d4f', name: ColorPrimary.red },
  { key: '#7cb305', name: ColorPrimary.green },
];

export const defaultToken: Partial<AliasToken> = {
  colorPrimary: '#cf1322',
  colorSuccess: '#66bb6a',
  colorInfo: '#29b6f6',
  colorWarning: '#ffa726',
  colorError: '#f44336',
  colorBorder: '#F0F0F0',
};

export const generateToken = (colorPrimary?: ColorPrimary) => ({
  ...defaultToken,
  colorPrimary: colorPrimaryPalette.find((color) => color.name === colorPrimary)?.key,
});
