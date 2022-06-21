import i18n from "./react-i18next.config";

export type I18nextLng = "en-US" | "zh-CN"; // | 'zh-TW'
export const local = new Map([
  // ['zh-TW', '繁'],
  ["zh-CN", "中"],
  ["en-US", "En"],
]);

export function useLocalGenerator() {
  const defaultLng = i18n.language;
  const localArr = Array.from(local);
  let next: number;
  return () => {
    const cur = localArr.findIndex((l) => l[0] === defaultLng);
    next = cur === localArr.length - 1 ? 0 : cur + 1;
    return localArr[next];
  };
}

export default i18n;
