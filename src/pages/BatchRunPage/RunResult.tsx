import { css } from '@emotion/react';
import { Empty, Spin, Tag } from 'antd';
import React from 'react';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TestResult } from '../../components/arex-request';
import { HoppRESTResponse } from '../../components/arex-request/helpers/types/HoppRESTResponse';
import { HoppTestResult } from '../../components/arex-request/helpers/types/HoppTestResult';
import { useStore } from '../../store';

interface RunResultProps {
  loading: boolean;
  dataSource: {
    key: string;
    parentNode: any;
    parentNodeData: any;
    data: {
      id: string;
      request: any;
      testResult: {
        response: HoppRESTResponse;
        testResult: HoppTestResult;
      };
    }[];
  }[];
}

const RunResult: FC<RunResultProps> = ({ loading, dataSource }) => {
  const { t } = useTranslation(['common']);
  return (
    <Spin spinning={loading}>
      {dataSource.length > 0 ? (
        <div>
          {dataSource.map((dataSourceItem, index) => {
            console.log(dataSourceItem);
            return (
              <div key={index}>
                <p
                  css={css`
                    font-size: 14px;
                    font-weight: bolder;
                  `}
                >
                  <span>GET</span>
                  <span
                    css={css`
                      margin-left: 12px;
                    `}
                  >
                    {dataSourceItem.parentNode.title}
                  </span>
                  <span
                    css={css`
                      font-weight: normal;
                      font-size: 12px;
                      margin-left: 12px;
                      color: grey;
                    `}
                  >
                    {dataSourceItem.parentNodeData?.endpoint}
                  </span>
                </p>
                {dataSourceItem.data.map((dataSourceItemDataItem, dataSourceItemDataIndex) => {
                  return (
                    <div key={dataSourceItemDataIndex}>
                      <div
                        css={css`
                          margin-bottom: 10px;
                        `}
                      >
                        <Tag>{t('case_tag')}</Tag>
                        <span>{dataSourceItemDataItem.request.name}</span>
                      </div>
                      <TestResult
                        mode={'simple'}
                        testResult={dataSourceItemDataItem.testResult.testResult}
                      ></TestResult>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty />
      )}
    </Spin>
  );
};

export default RunResult;
