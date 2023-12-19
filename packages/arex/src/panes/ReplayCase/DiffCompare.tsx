import { SettingOutlined } from '@ant-design/icons';
import { DiffPath } from '@arextest/arex-common';
import {
  DiffMatch,
  getJsonValueByPath,
  jsonIndexPathFilter,
  PathHandler,
  TargetEditor,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { FC, useCallback, useState } from 'react';

import { ComparisonService, ScheduleService } from '@/services';
import { DependencyParams, ExpirationType } from '@/services/ComparisonService';
import { InfoItem } from '@/services/ReportService';

export interface DiffCompareProps {
  appId: string;
  operationId: string;
  loading?: boolean;
  dataSource?: InfoItem[];
  onSortKey?: PathHandler;
  onDependencyChange?: (dependency?: InfoItem) => void;
  onClickCompareConfig: (data?: InfoItem) => void;
}

const DiffCompare: FC<DiffCompareProps> = (props) => {
  const { t } = useTranslation('components');
  const { message } = App.useApp();

  const [selectedDependency, setSelectedDependency] = useState<InfoItem>();

  const { run: insertIgnoreNode } = useRequest(
    (path: string[], type?: string) => {
      const isGlobal = type === 'global';
      const isTemporary = type === 'temporary';

      const dependencyParams: DependencyParams =
        isGlobal || selectedDependency?.isEntry
          ? ({} as DependencyParams)
          : {
              operationType: selectedDependency?.categoryName || selectedDependency?.operationType,
              operationName: selectedDependency?.operationName,
            };
      const temporaryParams = isTemporary
        ? {
            expirationType: ExpirationType.temporary,
            expirationDate: dayjs().add(7, 'day').valueOf(),
          }
        : {};

      return ComparisonService.insertIgnoreNode({
        operationId: isGlobal ? undefined : props.operationId,
        appId: props.appId,
        exclusions: path,
        ...dependencyParams,
        ...temporaryParams,
      });
    },
    {
      manual: true,
      onSuccess(success) {
        success && message.success(t('message.success', { ns: 'common' }));
      },
    },
  );

  const [modal, contextHolder] = Modal.useModal();
  const handleDiffMatch = useCallback<PathHandler>(
    ({ path, targetEditor, jsonString }) => {
      const another = targetEditor === TargetEditor.left ? TargetEditor.right : TargetEditor.left;
      const text1 = getJsonValueByPath(jsonString[targetEditor], path);
      const text2 = getJsonValueByPath(jsonString[another], path);

      modal.info({
        title: t('replay.diffMatch'),
        width: 800,
        maskClosable: true,
        content: <DiffMatch text1={text1} text2={text2} />,
        footer: false,
      });
    },
    [t],
  );

  const handleIgnoreKey = useCallback<PathHandler>(
    ({ path, type, targetEditor, jsonString }) => {
      const filteredPath = jsonIndexPathFilter(path, jsonString![targetEditor]);
      filteredPath && insertIgnoreNode(filteredPath, type);
    },
    [insertIgnoreNode],
  );

  return (
    <>
      <DiffPath
        count={false}
        operationId={props.operationId}
        extra={
          <TooltipButton
            icon={<SettingOutlined />}
            title={t('appSetting.compareConfig')}
            onClick={() => props.onClickCompareConfig()}
          />
        }
        itemsExtraRender={(data) => (
          <TooltipButton
            icon={<SettingOutlined />}
            title={t('appSetting.compareConfig')}
            onClick={(e) => {
              e.stopPropagation();
              props.onClickCompareConfig(data);
            }}
            style={{ marginRight: '6px' }}
          />
        )}
        loading={props.loading}
        data={props.dataSource || []}
        onChange={(dependency) => {
          setSelectedDependency(dependency);
          props.onDependencyChange?.(dependency);
        }}
        onIgnoreKey={handleIgnoreKey}
        onSortKey={props.onSortKey}
        onDiffMatch={handleDiffMatch}
        requestDiffMsg={ScheduleService.queryDiffMsgById}
        requestQueryLogEntity={ScheduleService.queryLogEntity}
      />

      {/* JsonDiffMathModal */}
      {contextHolder}
    </>
  );
};

export default DiffCompare;
