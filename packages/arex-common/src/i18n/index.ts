import { I18nextLng } from '@arextest/arex-core';

import arexCommonCn from './locales/cn.json';
import arexCommonEn from './locales/En.json';

export const arexCommonNamespace = 'arexCommon';

export const I18nResources = {
  [I18nextLng.cn]: {
    [arexCommonNamespace]: arexCommonCn,
  },
  [I18nextLng.en]: {
    [arexCommonNamespace]: arexCommonEn,
  },
};
