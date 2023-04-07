import { useRequest } from 'ahooks';
import { Badge, Descriptions, Space, Tabs, theme } from 'antd';
import dayjs from 'dayjs';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomSearchParams } from '../../router/useCustomSearchParams';
import ReplayService from '../../services/Replay.service';
import { PlanItemStatistics, RecordResult } from '../../services/Replay.type';
import CaseDetail from '../replay/CaseDetail';
import { PageFC } from './index';

type TagType = { label: ReactNode; key: string; children: ReactNode };

export type CaseDetailType = {
  recordId: string;
};

const ReplayCaseDetailPage: PageFC<CaseDetailType> = (props) => {
  const params = useCustomSearchParams();
  const { data = params.query.data } = props.page;

  const { recordId } = props.page.data;
  const { t } = useTranslation(['common', 'extra']);
  const [items, setItems] = useState<TagType[]>([]);
  const [recordInfo, setRecordInfo] = useState<any>({});
  const { token } = theme.useToken();

  useRequest(ReplayService.viewRecord, {
    defaultParams: [
      {
        recordId,
      },
    ],
    onSuccess(res) {
      const newResult: any = {};
      const recordInfo = {
        configVersion: '',
        appId: '',
        operationName: '',
        recordEnvironment: 'Prod',
        creationTime: 0,
      };
      res.map((item: RecordResult) => {
        // TODO 从主入口的节点获取参数值
        const categoryName: string = item.categoryType.name;
        // qconfig
        !recordInfo.configVersion &&
          item.targetRequest.attributes?.configBatchNo &&
          (recordInfo.configVersion = item.targetRequest.attributes.configBatchNo);
        // appId
        !recordInfo.appId && item.appId && (recordInfo.appId = item.appId);
        // operationName entryPoint=true 为主入口
        !recordInfo.operationName &&
          item.categoryType?.entryPoint &&
          (recordInfo.operationName = item.operationName);
        // recordEnvironment
        item.recordEnvironment === 1 && (recordInfo.recordEnvironment = 'Test');
        // creationTime
        !recordInfo.creationTime &&
          item.creationTime &&
          (recordInfo.creationTime = item.creationTime);

        if (categoryName in newResult) {
          newResult[categoryName].push(item);
        } else {
          newResult[categoryName] = [item];
        }
      }),
        !!recordInfo && setRecordInfo(recordInfo);
      setItems(
        Object.keys(newResult).map((item) => {
          const caseDetailList: any[] = [];
          caseDetailList.push(...newResult[item]);
          return {
            label: (
              <>
                <span>{item}</span>
                <Badge
                  size='small'
                  color={token.colorPrimary}
                  offset={[5, -5]}
                  count={caseDetailList.length}
                />
              </>
            ),
            key: item,
            children: <CaseDetail type={item} compareResults={caseDetailList} />,
          };
        }),
      );
    },
  });

  return (
    <Space direction='vertical' style={{ display: 'flex', paddingBottom: '16px' }}>
      <Descriptions
        column={2}
        size='small'
        title={<span>RecordId: {props.page.data.recordId}</span>}
      >
        <Descriptions.Item label='appId'> {recordInfo.appId} </Descriptions.Item>
        <Descriptions.Item label='recordEnvironment'>
          {recordInfo.recordEnvironment}
        </Descriptions.Item>
        <Descriptions.Item label='operationName'> {recordInfo.operationName} </Descriptions.Item>
        <Descriptions.Item label='creationTime'>
          {dayjs(recordInfo.creationTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
      <Tabs items={items} />
    </Space>
  );
};

export default ReplayCaseDetailPage;
