import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { Button, Checkbox, Col, Form, message, Row, Space, Tabs, Tree } from 'antd';
import { Divider } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { GlobalContext } from 'arex-request';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { genCaseTreeData } from '../../helpers/BatchRun/util';
import { treeFind } from '../../helpers/collection/util';
import { AgentAxiosAndTest } from '../../helpers/request';
import { NodeList } from '../../services/CollectionService';
import { FileSystemService } from '../../services/FileSystem.service';
import { useStore } from '../../store';
import RunResult from './RunResult';

const BaRuPage: React.FC = () => {
  const { store: globalStore } = useContext(GlobalContext);
  const urlPretreatment = (url: string) => {
    // 正则匹配{{}}
    const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
    let replaceVar = editorValueMatch[0];
    const env = globalStore.environment?.keyValues || [];
    for (let i = 0; i < env.length; i++) {
      if (env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')) {
        replaceVar = env[i].value;
      }
    }

    return url.replace(editorValueMatch[0], replaceVar);
  };

  const params = useParams();

  async function batchExecutionCase(runCases, collectionTreeData) {
    // 1.把case过滤出来
    runCases = runCases.filter(
      (i) => treeFind(collectionTreeData, (node) => node.key === i).nodeType === 2,
    );
    const caseResArr = await Promise.all(
      runCases.map((i) => {
        return FileSystemService.queryCase({ id: i }).then((r) => r.body);
      }),
    );
    const caseExecutionResult = [];
    for (let i = 0; i < caseResArr.length; i++) {
      const agentAxiosAndTestResponse = await AgentAxiosAndTest({
        request: {
          endpoint: urlPretreatment(caseResArr[i].address.endpoint),
          method: caseResArr[i].address.method,
          testScript: caseResArr[i].testScript,
          params: caseResArr[i].params,
          headers: caseResArr[i].headers,
          body: caseResArr[i].body,
        },
      }).catch(() => ({ testResult: undefined }));
      caseExecutionResult.push({
        key: caseResArr[i].id,
        request: {
          endpoint: urlPretreatment(caseResArr[i].address.endpoint),
          method: caseResArr[i].address.method,
          testScript: caseResArr[i].testScript,
          params: caseResArr[i].params,
          headers: caseResArr[i].headers,
          body: caseResArr[i].body,
        },
        testResult: agentAxiosAndTestResponse.testResult,
      });
    }
    return caseExecutionResult;
  }

  const [form] = Form.useForm();
  const onFinish = () => {
    setLoading(true);
    batchExecutionCase(checkValue, collectionTreeData).then((res) => {
      setResults(res);
      setLoading(false);
    });
  };
  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const [checkValue, setCheckValue] = useState([]);
  const { collectionTreeData } = useStore();

  const caseTreeData = useMemo(() => {
    if (params.rType === 'BatchRunPage') {
      return genCaseTreeData(collectionTreeData.filter((i) => i.key === params.rTypeId));
    } else {
      return [];
    }
  }, [collectionTreeData, params.rTypeId, params.rType]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [interfaceResponseArray, setInterfaceResponseArray] = useState([]);

  useEffect(() => {
    Promise.all(caseTreeData.map((i) => FileSystemService.queryInterface({ id: i.key })))
      .then((res) => {
        return res.map((i) => i.body);
      })
      .then((res) => {
        setInterfaceResponseArray(res);
      });
  }, [caseTreeData]);

  const resultData = useMemo(() => {
    // 遍历组合数据
    function deep(tree: any, nodeList: any = [], results): NodeList[] {
      const nodes = tree;
      Object.keys(nodes).forEach((value, index, array) => {
        nodeList.push({
          children: [],
          request: interfaceResponseArray.find((r) => r.id === nodes[value].key),
          fileNode: treeFind(collectionTreeData, (node) => node.id === nodes[value].key),
          key: nodes[value].key,
          testResult: results.find((r) => r.key === nodes[value].key)?.testResult,
        });
        if (nodes[value].children && Object.keys(nodes[value].children).length > 0) {
          deep(nodes[value].children, nodeList[index].children, results);
        }
      });
      return nodeList;
    }
    return deep(caseTreeData, [], results);
  }, [caseTreeData, results]);

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    setCheckValue(checkedKeys);
  };

  return (
    <Allotment
      css={css`
        height: 100%;
      `}
      vertical={true}
    >
      <Allotment.Pane preferredSize={400}>
        <Row
          gutter={16}
          css={css`
            height: 100%;
            padding: 14px;
          `}
        >
          <Col className='gutter-row' span={11}>
            <p
              css={css`
                font-weight: bolder;
              `}
            >
              Select need test case
            </p>
            <div
              css={css`
                height: 360px;
                overflow-y: scroll;
                .ant-checkbox-group {
                  display: flex;
                  flex-direction: column;
                }
              `}
            >
              <Tree treeData={caseTreeData} onCheck={onCheck} checkable />
            </div>
          </Col>
          <Col span={2}>
            <Divider style={{ height: '100%' }} type={'vertical'} />
          </Col>
          <Col className='gutter-row' span={11}>
            <div>
              <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
              >
                <Form.Item name='url' label=''>
                  <Checkbox disabled>Start Arex replay compare</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type='primary' htmlType='submit'>
                      Run Case
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Allotment.Pane>

      <Allotment.Pane>
        <div
          css={css`
            height: 100%;
            padding: 14px;
          `}
        >
          <Tabs
            style={{ height: '100%' }}
            items={[
              {
                label: 'Test',
                key: 'test',
                children: <RunResult loading={loading} result={resultData} />,
              },
              {
                label: 'Compare',
                key: 'compare',
                disabled: true,
              },
            ]}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};

export default BaRuPage;
