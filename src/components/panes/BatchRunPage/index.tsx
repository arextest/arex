// @ts-nocheck
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import { App, Button, Checkbox, Col, Form, Row, Space, Tree } from 'antd';
import { Divider } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { genCaseTreeData } from '../../../helpers/BatchRun/util';
import { treeFind, treeFindPath } from '../../../helpers/collection/util';
import { useStore } from '../../../store';
import RunResult from './RunResult';
import { getAllRequestsData, getBatchTestResults } from './util';

const BatchRunPage: React.FC = () => {
  const { t } = useTranslation(['page']);
  const { message } = App.useApp();
  const { activeEnvironment } = useStore();

  const params = useParams();

  const [form] = Form.useForm();
  const onFinish = () => {
    run();
  };
  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const [checkValue, setCheckValue] = useState([]);
  const { collectionTreeData } = useStore();

  const caseTreeData = useMemo(() => {
    if (params.pagesType === 'BatchRunPage') {
      if (params.rawId && params.rawId.length === 24) {
        return genCaseTreeData([treeFind(collectionTreeData, (node) => node.key === params.rawId)]);
      } else {
        return genCaseTreeData(collectionTreeData);
      }
    } else {
      return [];
    }
  }, [collectionTreeData, params.rawId, params.pagesType]);
  // 所有Request的数据
  const { data: allRequestsData } = useRequest(
    () => {
      return getAllRequestsData(caseTreeData.map((i) => i.key));
    },
    {
      refreshDeps: [caseTreeData],
    },
  );
  const { data, loading, run } = useRequest(
    () =>
      getBatchTestResults(
        checkValue.filter(
          (c) => treeFind(collectionTreeData, (node) => node.key === c)?.nodeType === 2,
        ),
        activeEnvironment?.keyValues || [],
      ),
    {
      manual: true,
    },
  );

  const dataSource = useMemo(() => {
    const caseData = (data || []).map((i) => {
      return {
        id: i.caseRequest.id,
        request: i.caseRequest,
        testResult: i.testResult,
      };
    });

    function findNodeParent(c) {
      return treeFindPath(collectionTreeData, (node: any) => node.key === c.id)?.at(-2);
    }

    return caseData.reduce((accumulator, currentValue) => {
      const nodeParent = findNodeParent(currentValue);
      const findPeIndex = accumulator.map((i) => i.key).findIndex((i) => i === nodeParent?.key);
      if (findPeIndex > -1) {
        accumulator[findPeIndex].data.push(currentValue);
      } else {
        accumulator.push({
          key: nodeParent.key,
          parentNodeData: allRequestsData.find((i) => i.id === nodeParent.key),
          parentNode: nodeParent,
          data: [currentValue],
        });
      }
      return accumulator;
    }, []);
  }, [data]);

  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
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
          <Col
            className='gutter-row'
            span={11}
            css={css`
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
                {t('batchRunPage.select_need_test_case')}
              </p>
              <Tree
                defaultExpandedKeys={['ROOT']}
                checkable
                checkedKeys={checkValue}
                treeData={[
                  {
                    key: 'ROOT',
                    title: 'ROOT',
                    children: caseTreeData,
                  },
                ]}
                onCheck={onCheck}
              />
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
                  <Checkbox checked={false} disabled>
                    {t('batchRunPage.start_arex_replay_compare')}
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      type='primary'
                      htmlType='submit'
                      disabled={!((allRequestsData?.length || 0) > 0)}
                    >
                      {t('batchRunPage.run_case')}
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
            overflow-y: auto;
          `}
        >
          <RunResult loading={loading} dataSource={dataSource} />
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};

export default BatchRunPage;
