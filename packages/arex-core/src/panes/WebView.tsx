import { GlobalOutlined } from '@ant-design/icons';
import React from 'react';

import { ArexPanesType } from '../constant';
import { ArexPaneFC, createArexPane } from './index';

export type WebProps = {
  url?: string;
};

const WebView: ArexPaneFC<WebProps> = (props) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <iframe
        width='100%'
        height='100%'
        loading='lazy'
        title='web-view'
        id={props.paneKey}
        src={props.data.url}
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default createArexPane(WebView, {
  type: ArexPanesType.WEB_VIEW,
  icon: <GlobalOutlined />,
  noPadding: true,
});
