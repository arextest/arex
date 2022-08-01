import { Alert } from 'antd';
import { useEffect } from 'react';

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
          注意：Chrome插件可突破浏览器跨域限制，请先安装
          <a
            href='https://chrome.google.com/webstore/detail/arex-chrome-extension/jmmficadjneeekafmnheppeoehlgjdjj'
            target={'_blank'}
            rel='noreferrer'
          >
            Chrome插件
          </a>
          后再运行。
        </div>
      }
    />
  );
};

export default CheckChromeExtension;
