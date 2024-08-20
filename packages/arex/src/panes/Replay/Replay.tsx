import {
  ArexPaneFC,
  clearLocalStorage,
  setLocalStorage,
  useTranslation,
} from '@arextest/arex-core';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRequest } from 'ahooks';
import { Alert, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { APP_ID_KEY } from '@/constant';
import { ApplicationService, ReportService } from '@/services';
import { useMenusPanes, useSystemConfig } from '@/store';
import { decodePaneKey } from '@/store/useMenusPanes';

import AppOwnersConfig, { AppOwnerConfigRef } from './AppOwnersConfig';
import AppTopBar from './AppTopBar';
import ReplayReport, { ReplayReportRef } from './ReplayReport';

const ReplayPage: ArexPaneFC = (props) => {
  const { activePane } = useMenusPanes();
  const { appAuth } = useSystemConfig();
  const { t } = useTranslation('components');

  const [replayWrapperRef] = useAutoAnimate();
  const replayReportRef = useRef<ReplayReportRef>(null);

  const { id: appId } = useMemo(() => decodePaneKey(props.paneKey), [props.paneKey]);

  useEffect(() => {
    activePane?.key === props.paneKey && setLocalStorage(APP_ID_KEY, appId);
    return () => clearLocalStorage(APP_ID_KEY);
  }, [activePane?.id]);

  const handleRefreshDep = () => {
    replayReportRef.current?.refreshReportList?.();
  };

  const [firstQueryRecordCount, setFirstQueryRecordCount] = useState(true);
  const { data: recordCount = 0, refresh: queryRecordCount } = useRequest(
    ReportService.queryRecordCount,
    {
      defaultParams: [
        {
          appId,
        },
      ],
      onSuccess() {
        firstQueryRecordCount && setFirstQueryRecordCount(false);
      },
    },
  );

  const [hasOwner, setHasOwner] = useState<boolean>();
  const appOwnerConfigRef = useRef<AppOwnerConfigRef>(null);

  const { data: appInfo, refresh: getAppInfo } = useRequest(ApplicationService.getAppInfo, {
    defaultParams: [appId],
    onSuccess(res) {
      setHasOwner(!appAuth || !!res.owners?.length);
    },
  });

  return (
    <div ref={replayWrapperRef}>
      {hasOwner === undefined && firstQueryRecordCount ? (
        <Spin spinning />
      ) : (
        <>
          {!hasOwner && (
            <Alert
              banner
              closable
              type='warning'
              message={
                <span>
                  {t('replay.noAppOwnerAlert')}
                  <a onClick={() => appOwnerConfigRef?.current?.open()}>
                    {t('replay.addOwner').toLowerCase()}
                  </a>
                  .
                </span>
              }
              style={{ margin: '-8px -16px 8px -16px' }}
            />
          )}

          <AppTopBar
            appId={appId}
            appName={appInfo?.appName}
            readOnly={!hasOwner}
            recordCount={recordCount}
            tags={appInfo?.tags}
            onRefresh={handleRefreshDep}
            onQueryRecordCount={queryRecordCount}
          />

          <ReplayReport ref={replayReportRef} appId={appId} readOnly={!hasOwner} />
        </>
      )}
      <AppOwnersConfig ref={appOwnerConfigRef} appId={appId} onAddOwner={getAppInfo} />
    </div>
  );
};

export default ReplayPage;
