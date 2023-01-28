import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Row } from 'antd';
import React, { FC } from 'react';

import { HoppRESTHeader } from '../../data/rest';

const Test = styled.div`
  border-right: 1px solid ${(props) => props.theme.colorBorder};
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};
  padding: 6px;
`;

export type LensesHeadersRendererEntryProps = {
  header: HoppRESTHeader;
  onPin: (recordId: string) => void;
};

const LensesHeadersRendererEntry: FC<LensesHeadersRendererEntryProps> = ({ header, onPin }) => {
  return (
    <Row>
      <Col className='gutter-row' span={12}>
        <Test>{header.key}</Test>
      </Col>

      <Col className='gutter-row' span={12}>
        <Test> {header.value}</Test>
      </Col>
    </Row>
  );
};

export default LensesHeadersRendererEntry;
