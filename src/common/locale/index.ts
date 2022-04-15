import en from "./en.json";
import zh from "./zh.json";

import { createI18n } from "vue-i18n";

const defaultLang: string = 'en';

const getLocale = (): any => {
  const lang: string = 'lang';
  if (!localStorage.getItem(lang)) {
    localStorage.setItem(lang, defaultLang);
  }
  return localStorage.getItem(lang);
};

const setLocale = (locale: string) => {
  localStorage.setItem('lang', locale);
};

const i18n = createI18n({
  locale: getLocale(),
  fallbackLocale: defaultLang,
  messages: {
    zh,
    en
  }
});

export {
  i18n,
  getLocale,
  setLocale
};
