import { message } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

const useCheckChromeExtension = () => {
  const { t } = useTranslation('components');
  const { extensionVersion } = useStore();

  useEffect(() => {
    if (!window.__AREX_EXTENSION_INSTALLED__) {
      useStore.setState({ extensionInstalled: false });
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
      console.info('[AREX] Extension not installed, please install it first.');
    } else if (window.__AREX_EXTENSION_VERSION__ !== extensionVersion) {
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
      console.info(t('http.extensionIncorrect', ` ${window.__AREX_EXTENSION_VERSION__}`));
    } else {
      useStore.setState({ extensionInstalled: true });
      console.info(`[AREX] Extension installed, version ${window.__AREX_EXTENSION_VERSION__}`);
    }
  }, []);
};

export default useCheckChromeExtension;
