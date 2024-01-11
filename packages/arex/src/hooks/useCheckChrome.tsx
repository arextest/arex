import { useTranslation } from '@arextest/arex-core';
import { App } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ExtensionVersion } from '@/constant';
import { getChromeVersion, versionStringCompare } from '@/utils';

const useCheckChrome = () => {
  const nav = useNavigate();
  const { t } = useTranslation('components');

  useEffect(() => {
    setTimeout(() => {
      if (getChromeVersion() < 0) {
        localStorage.clear();
        nav('/upgradebrowser');
      } else if (!window.__AREX_EXTENSION_INSTALLED__) {
        window.message.warning({
          content: '[AREX] Extension not installed, please install it first.',
        });
        console.log('[AREX] Extension not installed, please install it first.');
      } else if (versionStringCompare(window.__AREX_EXTENSION_VERSION__, ExtensionVersion) < 0) {
        window.message.info(
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
