import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { css } from '@emotion/react';
import { Col, Collapse, Row } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import useUserProfile from '../../store/useUserProfile';
import { WatermarkCodeMirror } from '../styledComponents';

const { Panel } = Collapse;

type CaseDetailProps = {
  type: string;
  compareResults: any[];
};

const CaseDetail: FC<CaseDetailProps> = (props) => {
  const { t } = useTranslation(['common']);

  const { theme } = useUserProfile();

  return (
    <Collapse>
      {props.compareResults.map((result, index) => (
        <Panel
          header={
            <span>
              {(props.type !== 'Database' ? '' : result.targetRequest.attributes.dbName + '-') +
                result.operationName}
            </span>
          }
          key={index}
        >
          <Row gutter={16}>
            <Col span={12}>
              {/*解决无法渲然全的bug，误删*/}
              <div
                css={css`
                  height: 1px;
                `}
              ></div>
              <WatermarkCodeMirror
                readOnly
                height='300px'
                extensions={[json()]}
                themeKey={theme}
                remark={t('request')}
                value={JSON.stringify(result.targetRequest, null, 2)}
              />
            </Col>
            <Col span={12}>
              {/*解决无法渲然全的bug，误删*/}
              <div
                css={css`
                  height: 1px;
                `}
              ></div>

              <span>{}</span>
              <WatermarkCodeMirror
                readOnly
                height='300px'
                themeKey={theme}
                extensions={[json()]}
                remark={t('response')}
                value={JSON.stringify(result.targetResponse, null, 2)}
              />
            </Col>
          </Row>
        </Panel>
      ))}
    </Collapse>
  );
};

export default CaseDetail;
