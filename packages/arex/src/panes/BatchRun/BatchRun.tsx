import { ArexPaneFC, EmptyWrapper, RequestMethodIcon } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Divider, Space, Tree, Typography } from 'antd';
import { TestResult } from 'arex-request-core';
import { cloneDeep } from 'lodash';
import React, { Key, useMemo, useState } from 'react';

import { sendRequest } from '@/helpers/postman';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import disabledNonCaseNode from './utils/disabledNonCaseNode';

const { Text } = Typography;

const BatchRun: ArexPaneFC = (props) => {
  const { paneKey } = props;
  const { id } = useMemo(() => decodePaneKey(paneKey), [paneKey]);

  const { activeEnvironment } = useEnvironments();
  const { collectionsTreeData, collectionsFlatData } = useCollections();
  const environment = useMemo(
    () => ({
      name: activeEnvironment?.envName || '',
      variables: activeEnvironment?.keyValues || [],
    }),
    [activeEnvironment],
  );

  const [checkValue, setCheckValue] = useState<Key[]>([]);

  const treeData = useMemo(
    () =>
      disabledNonCaseNode(
        cloneDeep(
          id && id === 'root' ? collectionsTreeData : collectionsFlatData.get(id)?.children || [], // collection right click folder to batch run
        ),
      ),
    [collectionsTreeData],
  );

  const {
    data = [],
    run: batchRun,
    loading,
  } = useRequest(async () => {
    const cases = await Promise.all(
      checkValue.map((key) => FileSystemService.queryRequest({ id: String(key), nodeType: 2 })),
    );
    const resAll = await Promise.all(
      cases.map((caseItem) => sendRequest(caseItem, environment).then((res) => res.testResult)),
    );
    return checkValue.map((key, index) => ({
      key,
      testResult: resAll[index],
      req: cases[index],
    }));
  });

  return (
    <Allotment
      vertical
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
                fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
                checkedKeys={checkValue}
                treeData={treeData.nodeData}
                onCheck={(value) =>
                  Array.isArray(value) ? setCheckValue(value) : setCheckValue(value.checked)
                }
              />
            </div>
          </div>
          <div
            css={css`
              flex: 1;
            `}
          >
            <Button
              css={css`
                margin: 20px;
              `}
              onClick={batchRun}
            >
              Run
            </Button>
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <EmptyWrapper
          loading={loading}
          empty={!data.length}
          style={{ height: '100%', padding: '14px', overflowY: 'auto' }}
        >
          {data.map((i, index) => (
            <div
              key={index}
              css={css`
                padding: 10px;
              `}
            >
              <Space>
                {React.createElement(RequestMethodIcon[i.req.method])}
                <Text>{i.req.name}</Text>
                <Text type='secondary'>{i.req.endpoint}</Text>
              </Space>
              {i.testResult.length ? (
                <TestResult testResult={i.testResult} />
              ) : (
                <Text
                  css={css`
                    display: block;
                    margin: 20px;
                  `}
                  type='secondary'
                >
                  No tests found
                </Text>
              )}
              <Divider
                css={css`
                  margin: 0;
                  margin-top: 10px;
                `}
              />
            </div>
          ))}
        </EmptyWrapper>
      </Allotment.Pane>
    </Allotment>
  );
};

export default BatchRun;
