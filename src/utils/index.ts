export const getLocalStorage = (key: string) => {
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : undefined;
};

export const setLocalStorage = (key: string, value: any) =>
  window.localStorage.setItem(key, JSON.stringify(value));
