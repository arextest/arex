import i18n from "i18next";
// i18next-browser-languagedetector插件
// 这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
// 详情请访问：https://github.com/i18next/i18next-browser-languageDetector
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// 引入需要实现国际化的简体、繁体、英文三种数据的json文件
import zhCnCommonJson from "./locales/zh-cn/common.json";
import zhCnComponentsJson from "./locales/zh-cn/components.json";
import zhCnLayoutJson from "./locales/zh-cn/layout.json";
import zhCnPageJson from "./locales/zh-cn/page.json";
import enUsCommonJson from "./locales/en-us/common.json";
import enUsComponentsJson from "./locales/en-us/components.json";
import enUsLayoutJson from "./locales/en-us/layout.json";
import enUsPageJson from "./locales/en-us/page.json";

const resources = {
  "zh-CN": {
    common: zhCnCommonJson,
    components: zhCnComponentsJson,
    layout: zhCnLayoutJson,
    page: zhCnPageJson,
  },
  "en-US": {
    common: enUsCommonJson,
    components: enUsComponentsJson,
    layout: enUsLayoutJson,
    page: enUsPageJson,
  },
};

i18n
  .use(LanguageDetector) // 嗅探当前浏览器语言 zh-CN
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  .init({
    // 初始化
    resources, // 本地多语言数据
    lng: localStorage.getItem("i18nextLng") || "en-US",
    fallbackLng: "en",
    detection: {
      caches: ["localStorage"], // 'sessionStorage', 'cookie'
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
