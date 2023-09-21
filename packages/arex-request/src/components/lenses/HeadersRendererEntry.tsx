import { styled } from '@arextest/arex-core';
import { Col, Row, theme } from 'antd';
import React, { FC } from 'react';

import { ArexRESTHeader } from '../../types';

const { useToken } = theme;
const LensesHeadersRendererEntry: FC<{ header: ArexRESTHeader }> = ({ header }) => {
  const token = useToken();
  const Test = styled.div`
    border-right: 1px solid ${() => token.token.colorBorder};
    border-bottom: 1px solid ${() => token.token.colorBorder};
    padding: 6px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    height: 35px;
  `;
  return (
    <div>
      <Row>
        <Col className='gutter-row' span={12}>
          <Test>{header.key}</Test>
        </Col>

        <Col className='gutter-row' span={12}>
          <Test> {header.value}</Test>
        </Col>
      </Row>
    </div>
  );
};

export default LensesHeadersRendererEntry;
