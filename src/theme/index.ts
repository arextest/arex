import colorLib from '@kurkle/color';
import { AliasToken } from 'antd/es/theme/interface';

export { default as GlobalConfigProvider } from './GlobalConfigProvider';

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
  // colorBgLayout: '#202020',
  colorTextBase: '#ffffffd9',
};

export const tokenMap = {
  [Theme.light]: lightToken,
  [Theme.dark]: darkToken,
};

export const generateToken = (theme: Theme, colorPrimary?: ColorPrimary) => {
  const primary = colorPrimaryPalette.find((color) => color.name === colorPrimary)?.key;
  if (primary)
    return {
      ...tokenMap[theme],
      colorPrimary: primary,
      colorLink: primary,
      colorLinkActive: primary,
      colorLinkHover: colorLib(primary).alpha(0.7).rgbString(),
    };
};
