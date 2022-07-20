import i18n from "./react-i18next.config";

export type I18nextLng = "en-US" | "zh-CN"; // | 'zh-TW'
export const local = new Map([
  // ['zh-TW', '繁'],
  ["zh-CN", "中"],
  ["en-US", "En"],
]);

export function useNextLang() {
  const defaultLng = i18n.language;
  const localArr = Array.from(local);
  const cur = localArr.findIndex((l) => l[0] === defaultLng);
  const next = cur === localArr.length - 1 ? 0 : cur + 1;
  return localArr[next];
}

export default i18n;
