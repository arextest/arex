import { StopOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Button, Card, Radio, Space, Spin, Table, Tabs, Tag, Typography } from 'antd';
import JSONEditor from 'jsoneditor';
import _ from 'lodash-es';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import axios from '../../../../../helpers/api/axios';
import { TooltipButton } from '../../../../index';
import { DiffJsonView, DiffJsonViewProps } from '../../../../replay/Analysis';
import { HttpContext } from '../../../index';
function removeNull(obj: any) {
  for (const key in obj) {
    if (obj[key] === null) {
      obj[key] = '';
    }
    if (typeof obj[key] == 'object') {
      removeNull(obj[key]);
    }
  }
  return obj;
}
const CompareResult: FC<{ responses: any[]; theme: string }> = ({ responses, theme }) => {
  const { data, loading } = useRequest(
    () => {
      return axios
        .post('/report/compare/quickCompare', {
          msgCombination: {
            baseMsg: JSON.stringify(removeNull(responses[0])),
            testMsg: JSON.stringify(removeNull(responses[1])),
          },
        })
        .then((res) => {
          const rows = res.body.diffDetails || [];
          return rows.map((r) => r.logs[0]);
        });
    },
    {
      refreshDeps: [responses],
    },
  );
  const diffData = {
    logs: data || [],
  };
  const [diffJsonViewData, setDiffJsonViewData] = useState<DiffJsonViewProps['data']>();
  const [diffJsonViewVisible, setDiffJsonViewVisible] = useState(false);
  const DiffMap: {
    [unmatchedType: string]: {
      text: string;
      color: string;
      desc?: string;
    };
  } = {
    '0': {
      text: 'Unknown',
      color: 'default',
    },
    '1': {
      text: 'Left Missing',
      color: 'orange',
      desc: 'is missing on the left',
    },
    '2': {
      text: 'Right Missing',
      color: 'blue',
      desc: 'is missing on the right',
    },
    '3': {
      text: 'Different Value',
      color: 'magenta',
    },
  };
  return (
    <div>
      <h4
        css={css`
          padding: 10px;
        `}
      >
        Compare Result
      </h4>
      <DiffJsonView
        data={diffJsonViewData}
        open={diffJsonViewVisible}
        onClose={() => setDiffJsonViewVisible(false)}
      />
      <Card
        size='small'
        title={!loading && `${diffData?.logs.length} issue(s)`}
        extra={
          <Button
            size='small'
            disabled={loading}
            style={{ marginLeft: '8px' }}
            onClick={() => {
              if (diffData) {
                console.log(diffData, 'diffData');
                setDiffJsonViewData({
                  baseMsg: JSON.stringify(responses[0]),
                  testMsg: JSON.stringify(responses[1]),
                  logs: diffData?.logs,
                });
                setDiffJsonViewVisible(true);
              }
            }}
          >
            Tree Mode
          </Button>
        }
        loading={loading}
        style={{ minHeight: '56px' }}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          {diffData?.logs.map((log, index) => (
            <div key={index} style={{ display: 'flex', flexFlow: 'row nowrap' }}>
              <Tag color={DiffMap[log.pathPair.unmatchedType]?.color}>
                {DiffMap[log.pathPair.unmatchedType]?.text}
              </Tag>

              {log.pathPair.unmatchedType === 3 ? (
                <Typography.Text>
                  {'Value of '}
                  <Typography.Text code>{log.path || '[]'}</Typography.Text>
                  {' is different, excepted '}
                  <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                    {log.baseValue || '[]'}
                  </Typography.Text>
                  {', actual '}
                  <Typography.Text code ellipsis style={{ maxWidth: '200px' }}>
                    {log.testValue || '[]'}
                  </Typography.Text>
                  {'.'}
                </Typography.Text>
              ) : (
                <span>
                  <Typography.Text code>{log.path}</Typography.Text>
                  {DiffMap[log.pathPair.unmatchedType].desc}
                </span>
              )}
            </div>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default CompareResult;
