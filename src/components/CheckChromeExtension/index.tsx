import { Alert } from 'antd';
import React, { useEffect } from 'react';

import { useStore } from '../../store';

const CheckChromeExtension = () => {
  useEffect(() => {
    if (!window.__AREX_EXTENSION_INSTALLED__) {
      useStore.setState({ extensionInstalled: false });
      console.info('[AREX] Extension not installed, please install it first.');
    } else {
      useStore.setState({ extensionInstalled: true });
      console.info('[AREX] Extension installed.');
    }
  }, []);

  return window.__AREX_EXTENSION_INSTALLED__ ? (
    <></>
  ) : (
    <Alert
      message={
        <div>
          Be careful：The Chrome Extension can break the cross-domain limit of the browser.
          Please install the&nbsp;
          <a
            href='https://chrome.google.com/webstore/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj'
            target={'_blank'}
            rel='noreferrer'
          >
            Chrome Extension
          </a>
          &nbsp;before you run it.
        </div>
      }
    />
  );
};

export default CheckChromeExtension;
