import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Badge, Button, Divider, Empty, Select, Space, theme, Typography } from 'antd';
import React, { FC, useState } from 'react';

import { Label } from '../../components/styledComponents';
import { SystemService } from '../../services/System.service';
import { Log as LogType } from '../../services/System.type';
import Log from './Log';

export const LogLevel = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'TRACE'] as const;
export const AppType = ['arex-web-api', 'arex-schedule', 'arex-storage'] as const;

const LogsWrapper = styled.div`
  height: 100vh;
  padding: 16px 16px 0;
  overflow-y: auto;
  .load-more {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
`;

const Logs: FC = () => {
  const {
    token: { colorError, colorSuccess, colorWarning, colorInfo },
  } = theme.useToken();
  const getLevelColor = (level: (typeof LogLevel)[number]) =>
    ({
      DEBUG: colorSuccess,
      INFO: colorInfo,
      WARN: colorWarning,
      ERROR: colorError,
      FATAL: colorError,
      TRACE: colorError,
    }[level]);

  const [level, setLevel] = useState<(typeof LogLevel)[number]>('INFO');
  const [appType, setAppType] = useState<(typeof AppType)[number]>('arex-web-api');

  const [logsData, setLogsData] = useState<LogType[]>([]);
  const { run: queryLogs, loading: loadingLogs } = useRequest(
    (previousId?: string) =>
      SystemService.queryLogs({
        pageSize: 10,
        level,
        previousId,
        tags: {
          'app-type': appType,
        },
      }),
    {
      onSuccess(res, [previousId]) {
        setLogsData(previousId ? [...logsData, ...res] : res);
      },
    },
  );

  const handleSearchLogs = () => {
    queryLogs();
  };

  const handleLoadMoreLogs = () => {
    queryLogs(logsData.at(-1)?.id);
  };

  return (
    <LogsWrapper>
      <div>
        <Space size='large' style={{ marginBottom: '12px' }}>
          <div>
            <Label>Level</Label>
            <Select
              value={level}
              optionLabelProp='label'
              options={LogLevel.map((value) => ({
                value,
                label: <Badge color={getLevelColor(value)} text={value} />,
              }))}
              onChange={setLevel}
              style={{ width: '120px' }}
            />
          </div>

          <div>
            <Label>AppType</Label>
            <Select
              value={appType}
              options={AppType.map((value) => ({ value }))}
              onChange={setAppType}
              style={{ width: '200px' }}
            />
          </div>
        </Space>

        <Button
          type='primary'
          icon={<SearchOutlined />}
          onClick={handleSearchLogs}
          style={{ marginLeft: 'auto', float: 'right' }}
        >
          Search
        </Button>
      </div>

      <Divider style={{ margin: '0 0 16px 0' }} />

      <Space direction='vertical' style={{ width: '100%' }}>
        {!loadingLogs && !logsData.length ? (
          <Empty />
        ) : (
          <>
            {logsData.map((log) => (
              <Log key={log.id} log={log} color={getLevelColor(log.level)} />
            ))}

            <div className='load-more'>
              <Button type='text' onClick={handleLoadMoreLogs}>
                <Typography.Text type='secondary'>
                  {loadingLogs ? <LoadingOutlined /> : 'load more...'}
                </Typography.Text>
              </Button>
            </div>
          </>
        )}
      </Space>
    </LogsWrapper>
  );
};

export default Logs;
