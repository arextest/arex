import { PlayCircleOutlined } from '@ant-design/icons';
import { PanesTitle, useArexPaneProps, useTranslation } from '@arextest/arex-core';
import { Button } from 'antd';
import React, { FC, useCallback, useMemo, useRef } from 'react';

import { PanesType } from '@/constant';
import { useNavPane } from '@/hooks';

import AppTitle from './AppTitle';
import CreatePlanModal, { CreatePlanModalRef } from './CreatePlanModal';
import RecordedCaseList, { RecordedCaseRef } from './RecordedCase';

type AppTopBarProps = {
  appId: string;
  appName?: string;
  readOnly?: boolean;
  recordCount?: number;
  tags?: Record<string, string[]>;
  onRefresh?: (reset?: boolean) => void;
  onQueryRecordCount?: () => void;
};

const AppTopBar: FC<AppTopBarProps> = ({
  appId,
  appName,
  readOnly,
  recordCount = 0,
  tags,
  onRefresh,
  onQueryRecordCount,
}) => {
  const navPane = useNavPane();
  const { t } = useTranslation(['components']);
  const { data } = useArexPaneProps<{ planId: string }>();

  const createPlanModalRef = useRef<CreatePlanModalRef>(null);
  const caseListRef = useRef<RecordedCaseRef>(null);

  const appTitle = useMemo(
    () => appName && `${readOnly ? `[${t('readOnly', { ns: 'common' })}] ` : ''}${appName}`,
    [readOnly, t, appName],
  );

  const handleRefresh = useCallback(() => {
    onQueryRecordCount?.();
    onRefresh?.();
  }, []);

  const handleSetting = useCallback(() => {
    navPane({
      id: appId,
      type: PanesType.APP_SETTING,
      name: appName,
    });
  }, [appId]);

  return (
    <div>
      <PanesTitle
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AppTitle
              appId={appId}
              planId={data?.planId}
              title={appTitle}
              readOnly={readOnly}
              count={recordCount}
              onClickTitle={() => {
                caseListRef.current?.open();
              }}
              onRefresh={handleRefresh}
              onSetting={handleSetting}
            />
          </div>
        }
        extra={
          <Button
            id='arex-replay-create-plan-btn'
            size='small'
            type='primary'
            disabled={readOnly}
            icon={<PlayCircleOutlined />}
            onClick={() => {
              createPlanModalRef.current?.open();
            }}
          >
            {t('replay.startButton')}
          </Button>
        }
      />

      <CreatePlanModal
        ref={createPlanModalRef}
        appId={appId}
        appName={appName}
        tags={tags}
        onCreated={() => onRefresh?.(true)}
      />

      <RecordedCaseList
        ref={caseListRef}
        appId={appId}
        appName={appName}
        onChange={onQueryRecordCount}
      />
    </div>
  );
};

export default AppTopBar;
