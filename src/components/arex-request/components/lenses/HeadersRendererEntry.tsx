import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Col, Row, theme } from 'antd';
import { FC, useEffect } from 'react';
import React from 'react';

import { HoppRESTHeader } from '../../data/rest';

const Test = styled.div`
  border-right: 1px solid ${(props) => props.theme.colorBorder};
  border-bottom: 1px solid ${(props) => props.theme.colorBorder};
  padding: 6px;
`;

const { useToken } = theme;
const LensesHeadersRendererEntry: FC<{ header: HoppRESTHeader }> = ({
  header,
}) => {
  const token = useToken();
  return (
    <div>
      <Row>
        <Col className="gutter-row" span={12}>
          <Test>{header.key}</Test>
        </Col>

        <Col className="gutter-row" span={12}>
          <Test> {header.value}</Test>
        </Col>
      </Row>
    </div>
  );
};

export default LensesHeadersRendererEntry;
