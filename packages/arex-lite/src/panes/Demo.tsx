import { FileOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { ArexPaneFC, createArexPane, decodeUrl, i18n, styled } from '@arextest/arex-core';
import React, { useState } from 'react';

import { MenusType, PanesType } from '../constant';
import useNavPane from '../hooks/useNavPane';

const StyledDiv = styled.div`
  color: ${(props) => props.theme.colorPrimary};
`;

const Demo: ArexPaneFC = (props) => {
  const paneNav = useNavPane();
  const [decode, setDecode] = useState<any>();

  return (
    <div>
      <div>DemoPane</div>
      <StyledDiv>zzz</StyledDiv>
      <Space>
        <div>url encode/decode demo </div>
        <Button
          onClick={() => {
            window.message.info('hello');
          }}
        >
          message
        </Button>

        <Button
          onClick={() => {
            const resource = i18n.getResourceBundle('cn', 'arex-menu');
            console.log(resource);
          }}
        >
          i18n
        </Button>

        <Button
          onClick={() => {
            paneNav({
              id: '123',
              type: PanesType.DEMO,
              data: { name: 'Tom', age: 10 },
            });
          }}
        >
          nav
        </Button>
        <Button
          onClick={() => {
            const decode = decodeUrl();
            setDecode(decode);
            console.log(decode);
          }}
        >
          decode url
        </Button>
      </Space>
      <div>{JSON.stringify(decode, null, 2)}</div>
    </div>
  );
};

export default createArexPane(Demo, {
  type: PanesType.DEMO,
  menuType: MenusType.DEMO,
  icon: <FileOutlined />,
});
