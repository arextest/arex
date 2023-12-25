import { QuestionCircleOutlined, SendOutlined } from '@ant-design/icons';
import {
  ArexPaneFC,
  css,
  EmptyWrapper,
  getLocalStorage,
  Label,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { ArexEnvironment, ArexResponse, EnvironmentSelect } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { Button, Divider, Popover, theme, TreeSelect, Typography } from 'antd';
import { cloneDeep } from 'lodash';
import React, { FC, Key, useCallback, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { CollectionNodeType, WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import BatchRunResultItem from '@/panes/BatchRun/BatchRunResultItem';
import { WorkspaceEnvironmentPair } from '@/panes/Request/EnvironmentDrawer';
import { EnvironmentService, FileSystemService } from '@/services';
import { useCollections } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import disabledNonCaseNode from './utils/disabledNonCaseNode';

const StatusBlock: FC<{
  color: string;
  text?: React.ReactNode;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <span style={{ marginRight: '4px' }}>
      <div
        style={{
          display: 'inline-block',
          height: '6px',
          width: '16px',
          margin: '2px 4px',
          backgroundColor: props.color,
        }}
      >
        {props.children}
      </div>
      <Typography.Text type='secondary'>{props.text}</Typography.Text>
    </span>
  );
};

const BatchRun: ArexPaneFC = (props) => {
  const { paneKey } = props;
  const { token } = theme.useToken();
  const { t } = useTranslation('page');
  const [workspaceId, id] = useMemo(() => decodePaneKey(paneKey).id.split('-'), [paneKey]);

  const { collectionsTreeData, collectionsFlatData } = useCollections();

  const [activeEnvironment, setActiveEnvironment] = useState<ArexEnvironment>();
  const [checkValue, setCheckValue] = useState<Key[]>([]);

  const [responseList, setResponseList] = useImmer<ArexResponse[]>([]);

  const treeData = useMemo(
    () =>
      disabledNonCaseNode(
        cloneDeep(
          id ? collectionsFlatData.get(id)?.children || [] : collectionsTreeData, // collection right click folder to batch run
        ),
      ),
    [collectionsTreeData],
  );

  const { data: environments } = useRequest(EnvironmentService.getEnvironments, {
    defaultParams: [{ workspaceId }],
    onSuccess(res) {
      const workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
        WORKSPACE_ENVIRONMENT_PAIR_KEY,
      );
      const initialEnvId = props.data?.environmentId || workspaceEnvironmentPair?.[workspaceId];
      if (initialEnvId) {
        const env = res.find((env) => env.id === initialEnvId);
        setActiveEnvironment(env);
      }
    },
  });

  const {
    data: cases = [],
    loading,
    runAsync: queryCases,
  } = useRequest(() =>
    Promise.all(
      checkValue.map((key) =>
        FileSystemService.queryRequest({ id: String(key), nodeType: CollectionNodeType.case }),
      ),
    ),
  );

  const [casesResults, setCasesResults] = useState<React.ReactNode>(null);
  const handleBatchRun = () => {
    setResponseList(
      [...Array(checkValue.length)].map(() => ({
        response: { type: 'loading', headers: undefined },
      })) as ArexResponse[],
    );
    queryCases().then((cases) => setCasesResults(getCasesResults(cases)));
  };

  const getCasesResults = useCallback(
    (cases: Awaited<ReturnType<typeof FileSystemService.queryRequest>>[]) =>
      cases.map((caseItem, index) => (
        <BatchRunResultItem
          id={`batch-run-result-item-${index}`}
          key={caseItem.id}
          environment={activeEnvironment}
          data={caseItem}
          onResponse={(response) => {
            setResponseList((res) => {
              res[index] = response;
            });
          }}
        />
      )),
    [activeEnvironment],
  );

  return (
    <div>
      <SpaceBetweenWrapper>
        <Typography.Text type='secondary' style={{ marginLeft: '16px' }}>
          {t('batchRunPage.selectCaseTip')}
        </Typography.Text>
        <EnvironmentSelect
          value={activeEnvironment?.id}
          options={environments}
          onChange={setActiveEnvironment}
        />
      </SpaceBetweenWrapper>
      <Divider style={{ margin: 0 }} />
      <div style={{ display: 'flex', padding: '8px 16px' }}>
        <TreeSelect
          multiple
          allowClear
          treeCheckable
          maxTagCount={3}
          placeholder={'Please select case'}
          fieldNames={{ label: 'nodeName', value: 'infoId', children: 'children' }}
          value={checkValue}
          treeData={treeData.nodeData}
          onChange={setCheckValue}
          style={{ flex: 1 }}
        />

        <Button
          type='primary'
          size='large'
          icon={<SendOutlined />}
          onClick={handleBatchRun}
          style={{ marginLeft: '16px' }}
        >
          {t('batchRunPage.batchSend')}
        </Button>
      </div>

      {!!cases.length && (
        <div style={{ padding: '0 16px 4px', marginBottom: '4px' }}>
          <div style={{ display: 'flex' }}>
            {responseList.map((item, index) => {
              const testAllSuccess = item.testResult?.every((test) => test.passed) ?? true;
              const testAllFail = item.testResult?.every((test) => !test.passed) ?? false;

              const requestStatusColor =
                item.response.type === 'loading'
                  ? token.colorFillSecondary
                  : item.response?.statusCode < 300
                  ? token.colorSuccess
                  : item.response?.statusCode < 400
                  ? token.colorWarning
                  : token.colorError;

              const testResultStatusColor = item.testResult?.length
                ? testAllSuccess
                  ? token.colorSuccess
                  : testAllFail
                  ? token.colorError
                  : token.colorWarning
                : token.colorFillSecondary;

              return (
                <div
                  key={index}
                  onClick={() => {
                    const element = document.getElementById(`batch-run-result-item-${index}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '16px',
                    cursor: 'pointer',
                    margin: `0 ${
                      responseList.length > 100 ? 2 : responseList.length > 50 ? 3 : 4
                    }px `,
                  }}
                >
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: requestStatusColor,
                    }}
                  />
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: testResultStatusColor,
                    }}
                  />
                </div>
              );
            })}

            <Popover
              title={
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Label>{t('batchRunPage.statusBlockStructure')}</Label>
                    <div style={{ display: 'inline-block' }}>
                      <div
                        style={{
                          textAlign: 'center',
                          backgroundColor: token.colorSuccess,
                          fontSize: '10px',
                          padding: '0 4px',
                          color: token.colorWhite,
                        }}
                      >
                        {t('batchRunPage.requestStatus')}
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          backgroundColor: token.colorError,
                          fontSize: '10px',
                          padding: '0 4px',
                          color: token.colorWhite,
                        }}
                      >
                        {t('batchRunPage.testStatus')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>{t('batchRunPage.requestStatus')}</Label>
                    <StatusBlock
                      color={token.colorFillSecondary}
                      text={t('batchRunPage.loading')}
                    />
                    <StatusBlock
                      color={token.colorSuccess}
                      text={t('batchRunPage.requestSuccess')}
                    />
                    <StatusBlock color={token.colorError} text={t('batchRunPage.requestFailed')} />
                  </div>
                  <div>
                    <Label>{t('batchRunPage.testStatus')}</Label>
                    <StatusBlock
                      color={token.colorFillSecondary}
                      text={t('batchRunPage.noTestScript')}
                    />
                    <StatusBlock color={token.colorSuccess} text={t('batchRunPage.allPassed')} />
                    <br />
                    <StatusBlock color={token.colorWarning} text={t('batchRunPage.SomeFailed')} />
                    <StatusBlock color={token.colorError} text={t('batchRunPage.allFailed')} />
                  </div>
                </>
              }
              placement='bottomRight'
              overlayStyle={{ maxWidth: '500px' }}
            >
              <QuestionCircleOutlined style={{ margin: '0 4px' }} />
            </Popover>
          </div>
        </div>
      )}
      <EmptyWrapper
        loading={loading}
        empty={!cases.length}
        css={css`
          height: calc(100vh - 226px);
          overflow: auto;
        `}
      >
        {casesResults}
      </EmptyWrapper>
    </div>
  );
};

export default BatchRun;
