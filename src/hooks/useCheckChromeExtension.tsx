import { message } from 'antd';
import React, { useEffect } from 'react';

import { useStore } from '../store';

const useCheckChromeExtension = () => {
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
    } else {
      useStore.setState({ extensionInstalled: true });
      console.info('[AREX] Extension installed.');
      console.log(window.__AREX_EXTENSION_VERSION__);
    }
  }, []);
};

export default useCheckChromeExtension;
