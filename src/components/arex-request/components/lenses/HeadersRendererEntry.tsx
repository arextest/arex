import styled from '@emotion/styled';
import { Col, Row } from 'antd';
import { FC } from 'react';

import { HoppRESTHeader } from '../../data/rest';

const Test = styled.div`
  border-right: 1px solid ${(props) => props.theme.color.border.primary};
  border-bottom: 1px solid ${(props) => props.theme.color.border.primary};
  padding: 6px;
`;

const LensesHeadersRendererEntry: FC<{ header: HoppRESTHeader }> = ({ header }) => {
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
