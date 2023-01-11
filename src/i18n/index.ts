import 'dayjs/locale/zh-cn';

import { Locale } from 'antd/es/locale';
import en from 'antd/locale/en_US';
import zh from 'antd/locale/zh_CN';

import i18n from './react-i18next.config';

export type I18nextLng = 'en-US' | 'zh-CN';

export const local: { key: I18nextLng; name: string }[] = [
  { key: 'en-US', name: 'English' },
  { key: 'zh-CN', name: '简体中文' },
];

export const localeMap: { [key in I18nextLng]: Locale } = {
  'zh-CN': zh,
  'en-US': en,
};

export default i18n;
