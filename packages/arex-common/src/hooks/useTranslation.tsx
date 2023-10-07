import { useTranslation as useArexCoreTranslation } from '@arextest/arex-core';

import { arexCommonNamespace } from '../i18n';

const useTranslation = () =>
  useArexCoreTranslation(arexCommonNamespace, {
    keyPrefix: arexCommonNamespace,
  });

export default useTranslation;
