// @ts-nocheck
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Divider, Empty, Space, Spin, Tree, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { TestResult } from 'arex-request-core';
import { useMemo, useState } from 'react';

import { genCaseTreeData } from '@/helpers/BatchRun/util';
import { sendRequest } from '@/helpers/postman';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments } from '@/store';
import { treeFind } from '@/utils';
const { Text } = Typography;
export const methodMap = {
  GET: {
    color: '#0cbb52',
  },
  PUT: {
    color: '#097bed',
  },
  POST: {
    color: '#ffb400',
  },
  DELETE: {
    color: '#eb2013',
  },
  PATCH: {
    color: '#212121',
  },
};

const BatchRun = () => {
  const { activeEnvironment } = useEnvironments();
  const { collectionsTreeData } = useCollections();
  const environment = useMemo(
    () => ({
      name: activeEnvironment?.envName || '',
      variables: activeEnvironment?.keyValues || [],
    }),
    [activeEnvironment],
  );
  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    setCheckValue(checkedKeys);
  };
  const [checkValue, setCheckValue] = useState([]);

  const keys = useMemo(() => {
    return checkValue.filter(
      (c) => treeFind(collectionsTreeData, (node) => node.infoId === c)?.nodeType === 2,
    );
  }, [checkValue]);

  // 树形结构数据
  const treeData = genCaseTreeData(collectionsTreeData);

  // 暂时写死
  const {
    data,
    run: run1,
    loading,
  } = useRequest(
    async () => {
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

      return keys.map((key, index) => {
        return {
          key,
          testResult: re[index],
          req: cases[index],
        };
      });
    },
    {
      onSuccess(res) {
        console.log(res);
      },
    },
  );
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
              <p
                css={css`
                  font-weight: bolder;
                `}
              >
                {/*{JSON.stringify(caseCheckValue)}*/}
              </p>
              <Tree
                defaultExpandedKeys={['ROOT']}
                checkable
                checkedKeys={checkValue}
                treeData={[
                  {
                    title: 'ROOT',
                    key: 'ROOT',
                    children: treeData,
                  },
                ]}
                onCheck={onCheck}
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
              onClick={() => {
                run1();
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
            {(data || []).length > 0 ? (
              (data || []).map((i, index) => {
                return (
                  <div
                    key={index}
                    css={css`
                      padding: 10px;
                    `}
                  >
                    <Space>
                      <span
                        css={css`
                          color: ${methodMap[i.req.method].color};
                        `}
                      >
                        {i.req.method}
                      </span>
                      {/*<Text>{i.req.name} &gt; </Text>*/}
                      <Text>{i.req.name}</Text>
                      <Text type='secondary'>{i.req.endpoint}</Text>
                    </Space>
                    {i.testResult.length > 0 ? (
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
                );
              })
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
