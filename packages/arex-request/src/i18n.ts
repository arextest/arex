import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cn from './locales/cn.json';
import en from './locales/en.json';

const resources = {
  cn: {
    translation: cn,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  // 初始化
  resources,
  lng: localStorage.getItem('locale') || 'en',
  fallbackLng: 'en',
});

export default i18n;
