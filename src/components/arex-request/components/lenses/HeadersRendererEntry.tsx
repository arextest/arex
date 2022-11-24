// @ts-nocheck
import { css } from '@emotion/react';
import { Col, Row } from 'antd';
import { FC } from 'react';

import { HoppRESTHeader } from '../../data/rest';

const test = css`
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 6px;
`;

const LensesHeadersRendererEntry: FC<{ header: HoppRESTHeader }> = ({ header }) => {
  return (
    <div>
      <Row>
        <Col className='gutter-row' span={12}>
          <div css={test}>{header.key}</div>
        </Col>

        <Col className='gutter-row' span={12}>
          <div css={test}> {header.value}</div>
        </Col>
      </Row>
    </div>
  );
};

export default LensesHeadersRendererEntry;
