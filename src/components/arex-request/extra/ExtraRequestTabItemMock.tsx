import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Card, Col, Input, message, Row } from 'antd';
import { useState } from 'react';

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

function tryParseJsonString<T>(jsonString?: string, errorTip?: string) {
  try {
    return JSON.parse(jsonString || '{}') as T;
  } catch (e) {
    console.error(e);
    errorTip && message.warn(errorTip);
  }
}

const tryPrettierJsonString = (jsonString: string, errorTip?: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (e) {
    errorTip && message.warn(errorTip);
    return jsonString;
  }
};

const ExtraRequestTabItemMock = ({ recordId, requestAxios }) => {
  const [dataSource, setDataSource] = useState([]);
  useMount(() => {
    requestAxios
      .post(`/storage/frontEnd/record/queryFixedRecord`, {
        recordId: recordId,
        categoryTypes: 0,
      })
      .then((res) => {
        const record = [];
        Object.keys(res.recordResult).forEach((item) => {
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
      {dataSource.map((i) => {
        return (
          <Card
            key={i.recordId}
            title={`${i.operationKey}: ${i.operation}`}
            style={{ margin: '0 0 10px 0' }}
          >
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
                  autoSize
                  value={i.request}
                  style={{ minHeight: '200px', flex: '1' }}
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
                <Input.TextArea autoSize value={i.response} style={{ minHeight: '200px' }} />
              </Col>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default ExtraRequestTabItemMock;
