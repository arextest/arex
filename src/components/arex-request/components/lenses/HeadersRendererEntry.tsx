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

const LensesHeadersRendererEntry: FC<{ header: HoppRESTHeader; onPin: any }> = ({
  header,
  onPin,
}) => {
  return (
    <div>
      {header.key === 'arex-record-id' ? (
        <Row>
          <Col className='gutter-row' span={12}>
            <Test>
              {header.key}
              <Button
                size={'small'}
                css={css`
                  visibility: hidden;
                `}
              >
                Pin
              </Button>
            </Test>
          </Col>

          <Col className='gutter-row' span={12}>
            <Test>
              {' '}
              {header.value}
              <Button
                css={css`
                  margin-left: 8px;
                `}
                type={'primary'}
                size={'small'}
                onClick={() => {
                  onPin(header.value);
                }}
              >
                Pin
              </Button>
            </Test>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col className='gutter-row' span={12}>
            <Test>{header.key}</Test>
          </Col>

          <Col className='gutter-row' span={12}>
            <Test> {header.value}</Test>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default LensesHeadersRendererEntry;
