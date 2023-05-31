// @ts-nocheck
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Divider, Space, Tree, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { TestResult } from 'arex-request-core';
import { useMemo, useState } from 'react';

import { genCaseTreeData } from '@/helpers/BatchRun/util';
import { sendRequest } from '@/helpers/postman';
import { FileSystemService } from '@/services';
import { useCollections, useEnvironments } from '@/store';
import { treeFind } from '@/utils';
const { Text } = Typography;

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
  const { data, run: run1 } = useRequest(
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
    <div
      css={css`
        height: calc(100vh - 100px);
      `}
    >
      <div
        css={css`
          height: 50%;
          display: flex;
        `}
      >
        <div
          css={css`
            flex: 1;
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
              treeData={treeData}
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
            onClick={() => {
              run1();
            }}
          >
            Run
          </Button>
        </div>
      </div>
      <div
        css={css`
          height: 50%;
        `}
      >
        {(data || []).map((i, index) => {
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
                    color: darkseagreen;
                  `}
                >
                  {i.req.method}
                </span>
                <Text>{i.req.name} &gt; </Text>
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
        })}
      </div>
    </div>
  );
};

export default BatchRun;
