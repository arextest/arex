import { I18nextLng } from './i18n/index.js';
import { FontSize } from './pages/Setting.js';
import { Theme, ThemeClassify, ThemeName } from './style/theme';
import DarkPurple from './style/theme/darkPurple';

export type DefaultConfig = {
  language: I18nextLng;
  theme: ThemeName;
  themePrimaryColor: string;
  themeClassify: ThemeClassify;
  fontSize: FontSize;
};

const defaultConfig: DefaultConfig = {
  language: 'en-US',
  theme: Theme.darkPurple,
  themePrimaryColor: DarkPurple.primaryColor,
  themeClassify: ThemeClassify.dark, // 深浅应于 theme 对应
  fontSize: 'medium',
};

export default defaultConfig;
