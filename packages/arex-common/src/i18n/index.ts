import { i18n, I18nextLng } from '@arextest/arex-core';

import arexCommonCn from './locales/cn.json';
import arexCommonEn from './locales/en.json';

export const arexCommonNamespace = 'arexCommon';

export const I18nResources = {
  [I18nextLng.cn]: {
    [arexCommonNamespace]: arexCommonCn,
  },
  [I18nextLng.en]: {
    [arexCommonNamespace]: arexCommonEn,
  },
};

i18n.addResourceBundle(I18nextLng.cn, arexCommonNamespace, I18nResources[I18nextLng.cn]);
i18n.addResourceBundle(I18nextLng.en, arexCommonNamespace, I18nResources[I18nextLng.en]);
