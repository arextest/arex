import { useTranslation } from '@arextest/arex-core';
import { App } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ExtensionVersion } from '../constant';
import { checkArexVersion, getChromeVersion, versionStringCompare } from '../utils';

const useCheckChrome = () => {
  const nav = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation('components');

  useEffect(() => {
    setTimeout(() => {
      if (getChromeVersion() < 0) {
        localStorage.clear();
        nav('/upgradebrowser');
      } else if (!checkArexVersion()) {
        // 检查是否更新过arex
        localStorage.clear();
        window.location.href = '/login';
      } else if (!window.__AREX_EXTENSION_INSTALLED__) {
        message.info(
          <div>
            Be careful：The Chrome Extension can break the cross-domain limit of the browser. Please
            install the&nbsp;
            <a
              href='https://chrome.google.com/webstore/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj'
              target={'_blank'}
              rel='noreferrer'
            >
              Chrome Extension
            </a>
            &nbsp;before you run it.
          </div>,
        );
        console.log('[AREX] Extension not installed, please install it first.');
      } else if (versionStringCompare(window.__AREX_EXTENSION_VERSION__, ExtensionVersion) < 0) {
        message.info(
          <span>
            {t('http.extensionIncorrect')}
            <a
              target={'_blank'}
              href='https://github.com/arextest/arex-chrome-extension/releases'
              rel='noreferrer'
            >
              {` ${window.__AREX_EXTENSION_VERSION__}`}
            </a>
          </span>,
        );
        console.log(t('http.extensionIncorrect', ` ${window.__AREX_EXTENSION_VERSION__}`));
      } else {
        console.log(`[AREX] Extension installed, version ${window.__AREX_EXTENSION_VERSION__}`);
      }
    }, 200);
  }, []);
};

export default useCheckChrome;
