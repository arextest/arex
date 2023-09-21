import {
  AimOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  ArexPaneFC,
  PanesTitle,
  PanesTitleProps,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, Divider, Popconfirm, Space } from 'antd';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';

import { PanesType } from '@/constant';
import { EnvironmentService } from '@/services';
import { useMenusPanes } from '@/store';
import { EnvironmentKeyValues } from '@/store/useEnvironments';
import { decodePaneKey, encodePaneKey } from '@/store/useMenusPanes';

import EditableKeyValueTable, { useColumns } from './EditableKeyValueTable';

const Environment: ArexPaneFC = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const { removePane } = useMenusPanes();
  const [activeWorkspaceId, id] = useMemo(
    () => decodePaneKey(props.paneKey).id.split('-'),
    [props.paneKey],
  );

  // const { environments, getEnvironments } = useEnvironments();

  const [keyValues, setKeyValues] = useImmer<EnvironmentKeyValues[]>([]);
  const columns = useColumns(setKeyValues, true);

  const { run: saveEnv } = useRequest(EnvironmentService.saveEnvironment, {
    manual: true,
    onSuccess() {
      message.success(t('message.saveSuccess', { ns: 'common' }));
      // getEnvironments();
    },
  });

  // const { run: duplicateEnvironment } = useRequest(
  //   () =>
  //     EnvironmentService.duplicateEnvironment({
  //       id: environment.id,
  //       workspaceId: activeWorkspaceId as string,
  //     }),
  //   {
  //     manual: true,
  //     ready: !!activeWorkspaceId,
  //     onSuccess(success) {
  //       // success && getEnvironments();
  //     },
  //   },
  // );

  const { run: deleteEnvironment } = useRequest(
    () =>
      EnvironmentService.deleteEnvironment({
        id: activeWorkspaceId,
        workspaceId: activeWorkspaceId as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,

      onSuccess(success) {
        if (success) {
          // getEnvironments();
          removePane(encodePaneKey({ type: PanesType.ENVIRONMENT, id: props.data.id }) as string);
        }
      },
    },
  );

  const handleTitleSave: PanesTitleProps['onSave'] = (envName) => {
    // saveEnv({ env: { ...environment, keyValues, envName } });
  };

  return (
    <>
      <PanesTitle
        editable
        title={'environment.envName'}
        extra={
          <Space>
            {/*<TooltipButton*/}
            {/*  icon={<CopyOutlined />}*/}
            {/*  title={t('env.duplicateCurrentEnv')}*/}
            {/*  onClick={duplicateEnvironment}*/}
            {/*/>*/}

            <Divider type='vertical' />

            <TooltipButton
              icon={<PlusOutlined />}
              title={t('env.createEnvKeyValue')}
              onClick={() =>
                setKeyValues((state) => {
                  state.push({ key: '', value: '', active: true });
                })
              }
            />

            <Popconfirm
              title={
                <span style={{ display: 'block', maxWidth: '256px' }}>
                  {t('env.delConfirmText')}
                </span>
              }
              onConfirm={deleteEnvironment}
              okText={t('yes', { ns: 'common' })}
              cancelText={t('no', { ns: 'common' })}
            >
              <Button size='small' type='text' icon={<DeleteOutlined />} />
            </Popconfirm>

            <TooltipButton
              color='primary'
              icon={<SaveOutlined />}
              title={t('save', { ns: 'common' })}
              // onClick={() => saveEnv({ env: { ...environment, keyValues } })}
            />
          </Space>
        }
        onSave={handleTitleSave}
      />

      <EditableKeyValueTable
        bordered
        showHeader
        size='small'
        rowKey='index'
        pagination={false}
        dataSource={keyValues}
        columns={columns}
        style={{ marginTop: '16px' }}
      />
    </>
  );
};

export default Environment;
