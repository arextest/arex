import { RequestMethodIcon } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Divider, Empty, Space, Spin, Tree, Typography } from 'antd';
import { TestResult } from 'arex-request-core';
import React, { useMemo, useState } from 'react';

import { sendRequest } from '@/helpers/postman';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments } from '@/store';
const { Text } = Typography;

const BatchRun = () => {
  const { activeEnvironment } = useEnvironments();
  const { collectionsTreeData, collectionsFlatData } = useCollections();
  const environment = useMemo(
    () => ({
      name: activeEnvironment?.envName || '',
      variables: activeEnvironment?.keyValues || [],
    }),
    [activeEnvironment],
  );

  const [checkValue, setCheckValue] = useState<string[]>([]);

  const keys = useMemo(
    () => checkValue.filter((key) => collectionsFlatData.get(key)?.nodeType === 2),
    [checkValue, collectionsFlatData],
  );

  const {
    data = [],
    run: queryRequest,
    loading,
  } = useRequest(async () => {
    const cases = await Promise.all(
      keys.map((key) => FileSystemService.queryRequest({ id: key, nodeType: 2 })),
    );
    const re = await Promise.all(
      cases.map((c) =>
        sendRequest(c, environment).then((r) => {
          return r.testResult;
        }),
      ),
    );

    return keys.map((key, index) => ({
      key,
      testResult: re[index],
      req: cases[index],
    }));
  });

  return (
    <Allotment
      vertical={true}
      css={css`
        height: calc(100vh - 120px);
      `}
    >
      <Allotment.Pane preferredSize={400}>
        <div
          css={css`
            display: flex;
            height: 100%;
          `}
        >
          <div
            css={css`
              flex: 1;
              height: 100%;
            `}
          >
            <div
              css={css`
                overflow-y: scroll;
                height: 100%;
                .ant-checkbox-group {
                  display: flex;
                  flex-direction: column;
                }
              `}
            >
              <Tree
                checkable
                checkedKeys={checkValue}
                fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
                treeData={collectionsTreeData}
                onCheck={(key) => setCheckValue(key as string[])}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Button
              style={{ margin: '20px' }}
              onClick={() => {
                queryRequest();
              }}
            >
              Run
            </Button>
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div
          css={css`
            height: 100%;
            padding: 14px;
            overflow-y: auto;
          `}
        >
          <Spin spinning={loading}>
            {data.length > 0 ? (
              data.map((i, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                  }}
                >
                  <Space>
                    {React.createElement(RequestMethodIcon[i.req.method])}
                    <Text>{i.req.name}</Text>
                    <Text type='secondary'>{i.req.endpoint}</Text>
                  </Space>
                  {i.testResult.length > 0 ? (
                    <TestResult testResult={i.testResult} />
                  ) : (
                    <Text
                      style={{
                        display: 'block',
                        margin: '20px',
                      }}
                      type='secondary'
                    >
                      No tests found
                    </Text>
                  )}
                  <Divider
                    style={{
                      margin: 0,
                      marginTop: '10px',
                    }}
                  />
                </div>
              ))
            ) : (
              <Empty />
            )}
          </Spin>
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};

export default BatchRun;
