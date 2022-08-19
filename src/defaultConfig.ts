import { I18nextLng } from './i18n/index.js';
import { FontSize } from './pages/Setting.js';
import { Theme, ThemeClassify, ThemeName } from './style/theme/index.js';

export type DefaultConfig = {
  language: I18nextLng;
  theme: ThemeName;
  themeClassify: ThemeClassify;
  fontSize: FontSize;
};

const defaultConfig: DefaultConfig = {
  language: 'en-US',
  theme: Theme.lightPurple,
  themeClassify: ThemeClassify.light, // 深浅应于 theme 对应
  fontSize: 'medium',
};

export default defaultConfig;
