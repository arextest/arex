// import 'dayjs/locale/zh-cn';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en-us.json';
import zh from './locales/zh-cn.json';

const resources = {
  'zh-CN': {
    translation: zh,
  },
  'en-US': {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  // 初始化
  resources,
  lng: localStorage.getItem('locale') || 'en-US',
  fallbackLng: 'en',
  detection: {
    caches: ['localStorage'], // 'sessionStorage', 'cookie'
  },
});

export type I18nextLng = 'en-US' | 'zh-CN';

export const local: { key: I18nextLng; name: string }[] = [
  { key: 'en-US', name: 'English' },
  { key: 'zh-CN', name: '简体中文' },
];

export const localeMap: { [key in I18nextLng]: any } = {
  'zh-CN': zh,
  'en-US': en,
};

export default i18n;
