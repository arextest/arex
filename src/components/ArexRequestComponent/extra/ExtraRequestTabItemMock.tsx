import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Card, Col, Divider, Input, Row } from 'antd';
import { useState } from 'react';
import request from '../../../helpers/api/axios';
import { tryParseJsonString } from '../../../helpers/utils';

// import request from '../../../../../helpers/api/axios';
// import { tryParseJsonString } from '../../../../../helpers/utils';

// import request from '../../api/axios';
// import { tryParseJsonString } from '../../helpers/utils';

const ExtraRequestTabItemMock = ({ recordId }) => {
  const [dataSource, setDataSource] = useState([]);
  useMount(() => {
    request
      .post(`/storage/frontEnd/record/queryFixedRecord`, {
        recordId: recordId,
        categoryTypes: 0,
      })
      .then((res) => {
        const record = [];
        Object.keys(res.recordResult).forEach((item) => {
          const getRequestKey = {
            '4': {
              operation: 'clusterName',
              request: 'redisKey',
              response: 'response',
            },
            '5': {
              operation: 'clazzName',
              request: 'operationKey',
              response: 'response',
            },
            '6': {
              operation: 'service',
              request: 'request',
              response: 'response',
            },
            '7': {
              operation: 'expCode',
              request: 'version',
              response: 'response',
            },
            '13': {
              operation: 'url',
              request: 'request',
              response: 'response',
            },
            '14': {
              operation: 'dbName',
              request: 'sql',
              response: 'response',
            },
            '15': {
              operation: 'path',
              request: 'request',
              response: 'response',
            },
          };
          for (let i = 0; i < res.recordResult[item].length; i++) {
            const recordResult = tryParseJsonString(res.recordResult[item][i]);
            record.push({
              key: item,
              ...recordResult,
              request: recordResult[getRequestKey[item].request],
              operation: recordResult[getRequestKey[item].operation],
              requestKey: getRequestKey[item].request,
              operationKey: getRequestKey[item].operation,
            });
          }
        });
        setDataSource(record);
      });
  });
  return (
    <div
      css={css`
        max-height: 500px;
        overflow-y: auto;
      `}
    >
      {JSON.stringify(dataSource.appId)}
      {dataSource.map((i) => {
        return (
          <Card style={{ margin: '0 0 10px 0' }}>
            <p
              css={css`
                font-weight: bolder;
                margin-bottom: 10px;
                font-size: 18px;
              `}
            >
              {i.operationKey}:{i.operation}
            </p>
            <Divider />
            <Row gutter={16}>
              <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  css={css`
                    font-weight: bolder;
                    margin-bottom: 10px;
                    font-size: 16px;
                  `}
                >
                  {i.requestKey}
                </div>
                <Input.TextArea
                  style={{ height: '100%', minHeight: '200px', flex: '1' }}
                  readOnly
                  autoSize
                  value={i.request}
                />
              </Col>
              <Col span={12}>
                <div
                  css={css`
                    font-weight: bolder;
                    margin-bottom: 10px;
                    font-size: 16px;
                  `}
                >
                  response
                </div>
                <Input.TextArea style={{ height: '100%' }} readOnly autoSize value={i.response} />
              </Col>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default ExtraRequestTabItemMock;
