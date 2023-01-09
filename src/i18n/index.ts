import 'dayjs/locale/zh-cn';

import en from 'antd/es/locale/en_US';
import zh from 'antd/es/locale/zh_CN';
import { Locale } from 'antd/es/locale-provider';

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
