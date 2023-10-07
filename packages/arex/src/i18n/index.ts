import { ArexMenuNamespace, ArexPaneNamespace, I18nextLng } from '@arextest/arex-core';

import arexMenuCn from './locales/cn/arex-menu.json';
import arexPaneCn from './locales/cn/arex-pane.json';
import commonCn from './locales/cn/common.json';
import componentsCn from './locales/cn/components.json';
import pageCn from './locales/cn/page.json';
import shortcutsCn from './locales/cn/shortcuts.json';
import arexMenuEn from './locales/en/arex-menu.json';
import arexPaneEn from './locales/en/arex-pane.json';
import commonEn from './locales/en/common.json';
import componentsEn from './locales/en/components.json';
import pageEn from './locales/en/page.json';
import shortcutsEn from './locales/en/shortcuts.json';

const resources = {
  [I18nextLng.cn]: {
    [ArexMenuNamespace]: arexMenuCn,
    [ArexPaneNamespace]: arexPaneCn,
    common: commonCn,
    translation: commonCn,
    components: componentsCn,
    page: pageCn,
    shortcuts: shortcutsCn,
  },
  [I18nextLng.en]: {
    [ArexMenuNamespace]: arexMenuEn,
    [ArexPaneNamespace]: arexPaneEn,
    common: commonEn,
    translation: commonEn,
    components: componentsEn,
    page: pageEn,
    shortcuts: shortcutsEn,
  },
};

export default resources;
