import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { ArexMenuNamespace, ArexPaneNamespace, I18_KEY } from '../constant';
import arexMenuCn from './locales/cn/arex-menu.json';
import arexPaneCn from './locales/cn/arex-pane.json';
import commonCn from './locales/cn/common.json';
import arexPaneEn from './locales/en/arex-pane.json';
import arexMenuEn from './locales/en/arex-pane.json';
import commonEn from './locales/en/common.json';

const resources = {
  cn: {
    translation: commonCn,
    [ArexPaneNamespace]: arexPaneCn,
    [ArexMenuNamespace]: arexMenuCn,
  },
  en: {
    translation: commonEn,
    [ArexPaneNamespace]: arexPaneEn,
    [ArexMenuNamespace]: arexMenuEn,
  },
};

export enum I18nextLng {
  'en' = 'en',
  'cn' = 'cn',
}

i18n.use(initReactI18next).init({
  resources,
  partialBundledLanguages: true,
  lng: localStorage.getItem(I18_KEY) || I18nextLng.en,
  fallbackLng: I18nextLng.en,
  detection: {
    caches: ['localStorage'], // 'sessionStorage', 'cookie'
  },
  interpolation: {
    escapeValue: false,
  },
});

export const local: { key: `${I18nextLng}`; name: string }[] = [
  { key: I18nextLng.en, name: 'English' },
  { key: I18nextLng.cn, name: '简体中文' },
];

export { i18n };
export { getI18n, useTranslation } from 'react-i18next';
export default i18n;
