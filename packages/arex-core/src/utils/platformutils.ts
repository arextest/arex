import { capitalizeFirstLetter } from './url';

export function isAppleDevice() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export function getPlatformSpecialKey() {
  return isAppleDevice() ? '⌘' : 'Ctrl';
}

export function getPlatformAlternateKey() {
  return isAppleDevice() ? '⌥' : 'Alt';
}

export function transformPlatformKey(key: string) {
  const _key = key.toLowerCase();

  if (_key === 'ctrl') return getPlatformSpecialKey();
  else if (_key === 'alt') return getPlatformAlternateKey();
  else return capitalizeFirstLetter(key);
}
