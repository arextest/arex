import { I18nextLng } from './i18n';
import { ColorPrimary, CompactMode, DarkMode } from './theme';

export type DefaultConfig = {
  language: I18nextLng;
  colorPrimary: ColorPrimary;
  darkMode: DarkMode;
  compactMode: CompactMode;
};

const defaultConfig: Readonly<DefaultConfig> = {
  language: 'en-US',
  colorPrimary: ColorPrimary.green,
  darkMode: false,
  compactMode: false,
};

export default defaultConfig;
