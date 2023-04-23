import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en-us.json';
import cn from './locales/zh-cn.json';

const resources = {
  cn: {
    translation: cn,
  },
  en: {
    translation: en,
  },
};

export enum I18nextLng {
  'en' = 'en',
  'cn' = 'cn',
}
// TODO Add after init https://www.i18next.com/how-to/add-or-load-translations#add-after-init
i18n.use(initReactI18next).init({
  // 初始化
  resources,
  lng: localStorage.getItem('locale') || I18nextLng.en,
  fallbackLng: I18nextLng.en,
  detection: {
    caches: ['localStorage'], // 'sessionStorage', 'cookie'
  },
});

export const local: { key: `${I18nextLng}`; name: string }[] = [
  { key: 'en', name: 'English' },
  { key: 'cn', name: '简体中文' },
];

export const localeMap: { [key in I18nextLng]: object } = {
  cn,
  en,
};

export default i18n;
