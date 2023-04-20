import i18n from 'i18next';
// i18next-browser-language-detector插件
// 这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
// 详情请访问：https://github.com/i18next/i18next-browser-languageDetector
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { I18_KEY } from '../constant';
// enUS
import enUsCommonJson from './locales/en-us/common.json';
import enUsComponentsJson from './locales/en-us/components.json';
import enUsPageJson from './locales/en-us/page.json';
// zhCN
import zhCnCommonJson from './locales/zh-cn/common.json';
import zhCnComponentsJson from './locales/zh-cn/components.json';
import zhCnPageJson from './locales/zh-cn/page.json';

const resources = {
  'zh-CN': {
    common: zhCnCommonJson,
    translation: zhCnCommonJson,
    components: zhCnComponentsJson,
    page: zhCnPageJson,
  },
  'en-US': {
    common: enUsCommonJson,
    translation: enUsCommonJson,
    components: enUsComponentsJson,
    page: enUsPageJson,
  },
};

i18n
  .use(LanguageDetector) // 嗅探当前浏览器语言 zh-CN
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  .init({
    // 初始化
    resources, // 本地多语言数据
    lng: localStorage.getItem(I18_KEY) || 'en-US',
    fallbackLng: 'en',
    detection: {
      caches: ['localStorage'], // 'sessionStorage', 'cookie'
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
