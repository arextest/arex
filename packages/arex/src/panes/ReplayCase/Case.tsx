import { BugOutlined, RedoOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { HighlightRowTable, useArexPaneProps, useTranslation } from '@arextest/arex-core';
import { usePagination } from 'ahooks';
import { Button, Dropdown, TableProps, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, Key, useMemo } from 'react';

import { CollectionNodeType, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { ReportService } from '@/services';
import { PlanItemStatistics, ReplayCaseType } from '@/services/ReportService';
import { useWorkspaces } from '@/store';
import { generateId } from '@/utils';

export type CaseProps = {
  planItemId: string;
  planId: string;
  filter?: Key;
  onClick?: (record: ReplayCaseType) => void;
  onChange?: TableProps<ReplayCaseType>['onChange'];
  onClickSaveCase?: (record: ReplayCaseType) => void;
  onClickRerunCase?: (recordId: string) => void;
};

const Case: FC<CaseProps> = (props) => {
  const { data } = useArexPaneProps<PlanItemStatistics>();
  const { activeWorkspaceId } = useWorkspaces();
  const { t } = useTranslation(['components']);

  const navPane = useNavPane();

  const filterMap = useMemo(
    () => [
      { text: t('replay.success'), value: 0 },
      { text: t('replay.failed'), value: 1 },
      { text: t('replay.invalid'), value: 2 },
    ],
    [t],
  );

  const columnsCase: ColumnsType<ReplayCaseType> = [
    {
      title: t('replay.recordId'),
      dataIndex: 'recordId',
      render: (recordId, record) => <a onClick={() => props.onClick?.(record)}>{recordId}</a>,
    },
    {
      title: t('replay.replayId'),
      dataIndex: 'replayId',
    },
    {
      title: t('replay.status'),
      width: 100,
      defaultFilteredValue: props.filter !== undefined ? [props.filter.toString()] : undefined,
      filterMultiple: false,
      filters: filterMap,
      onFilter: (value, record) => record.diffResultCode === value,
      render: (_, record) => (
        <Tag color={['green', 'red', 'blue'][record.diffResultCode]}>
          {[t('replay.success'), t('replay.failed'), t('replay.invalid')][record.diffResultCode]}
        </Tag>
      ),
    },
    {
      title: t('replay.action'),
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex' }}>
          <Button
            key='caseDetail'
            type='link'
            size='small'
            icon={<SearchOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navPane({
                type: PanesType.CASE_DETAIL,
                id: record.recordId,
                data: { ...record, appId: data?.appId },
              });
            }}
          >
            {t('replay.recordDetail')}
          </Button>
          <Dropdown.Button
            key='case'
            size='small'
            type='link'
            trigger={['click']}
            destroyPopupOnHide
            buttonsRender={(buttons) => [
              <span key='primaryAction'>{buttons[0]}</span>,
              <span key='extraAction' onClick={(e) => e.stopPropagation()}>
                {buttons[1]}
              </span>,
            ]}
            menu={{
              items: [
                {
                  label: t('replay.debug'),
                  key: 'debug',
                  icon: <BugOutlined />,
                },
                {
                  label: t('replay.rerun'),
                  key: 'rerun',
                  icon: <RedoOutlined />,
                },
              ],

              onClick: (e) => {
                switch (e.key) {
                  case 'debug': {
                    navPane({
                      type: PanesType.REQUEST,
                      id: `${activeWorkspaceId}-${CollectionNodeType.case}-${generateId(12)}`,
                      icon: 'Get',
                      name: record.recordId,
                      data: {
                        recordId: record.recordId,
                        planId: props.planId,
                      },
                    });
                    break;
                  }
                  case 'rerun': {
                    props.onClickRerunCase?.(record.recordId);
                    break;
                  }
                }
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              props.onClickSaveCase?.(record);
            }}
          >
            <SaveOutlined />
            {t('replay.saveCase')}
          </Dropdown.Button>
        </div>
      ),
    },
  ];

  const {
    data: { list: caseData } = { list: [] },
    pagination,
    loading,
  } = usePagination(
    (params) =>
      ReportService.queryReplayCase({
        pageIndex: params.current,
        pageSize: params.pageSize,
        planItemId: props.planItemId,
        diffResultCode: Number(props.filter),
        needTotal: true,
      }),
    {
      ready: !!props.planItemId,
      refreshDeps: [props.planItemId],
      defaultPageSize: 5,
    },
  );

  return (
    <HighlightRowTable
      size='small'
      rowKey='recordId'
      loading={loading}
      columns={columnsCase}
      dataSource={caseData}
      pagination={pagination}
      onRowClick={props.onClick}
      onChange={props.onChange}
    />
  );
};

export default Case;
