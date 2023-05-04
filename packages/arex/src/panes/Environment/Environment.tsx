import {
  AimOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Divider, Popconfirm, Space } from 'antd';
import { ArexPaneFC, PanesTitle, PanesTitleProps, TooltipButton, useTranslation } from 'arex-core';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';

import { EnvironmentService } from '../../services';
import { useEnvironments, useMenusPanes, useWorkspaces } from '../../store';
import { Environment } from '../../store/useEnvironments';
import EditableKeyValueTable, { useColumns } from './EditableKeyValueTable';

const Environment: ArexPaneFC<Environment> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);
  const { activeWorkspaceId } = useWorkspaces();
  const { removePane } = useMenusPanes();

  const { activeEnvironment, environments, setActiveEnvironment, getEnvironments } =
    useEnvironments();

  const environment = useMemo(
    () => environments.find((env) => env.id === props.data.id) || props.data,
    [props.data.id, environments],
  );

  const [keyValues, setKeyValues] = useImmer(environment?.keyValues || []);

  const { run: saveEnv } = useRequest(EnvironmentService.saveEnvironment, {
    manual: true,
    onSuccess() {
      message.success(t('message.saveSuccess'));
      getEnvironments();
    },
  });

  const { run: duplicateEnvironment } = useRequest(
    () =>
      EnvironmentService.duplicateEnvironment({
        id: environment.id,
        workspaceId: activeWorkspaceId as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,
      onSuccess(success) {
        success && getEnvironments();
      },
    },
  );

  const { run: deleteEnvironment } = useRequest(
    () =>
      EnvironmentService.deleteEnvironment({
        id: environment.id,
        workspaceId: activeWorkspaceId as string,
      }),
    {
      manual: true,
      ready: !!activeWorkspaceId,

      onSuccess(success) {
        if (success) {
          getEnvironments();
          // TODO not work
          removePane(props.data.id);
        }
      },
    },
  );

  const handleTitleSave: PanesTitleProps['onSave'] = (envName) =>
    saveEnv({ env: { ...environment, keyValues, envName } });

  return (
    <>
      <PanesTitle
        editable
        title={environment.envName}
        extra={
          <Space>
            <TooltipButton
              icon={<AimOutlined />}
              placement='left'
              title={t('env.setCurrentEnv')}
              disabled={activeEnvironment?.id === props.data.id}
              onClick={() => setActiveEnvironment(environment as Environment)}
            />
            <TooltipButton
              icon={<CopyOutlined />}
              title={t('env.duplicateCurrentEnv')}
              onClick={duplicateEnvironment}
            />

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
              icon={<SaveOutlined />}
              title={t('save', { ns: 'common' })}
              onClick={() => saveEnv({ env: { ...environment, keyValues } })}
            />
          </Space>
        }
        onSave={handleTitleSave}
      />

      <EditableKeyValueTable
        bordered
        showHeader
        size='small'
        pagination={false}
        dataSource={keyValues}
        // @ts-ignore
        columns={useColumns(setKeyValues, true)}
        style={{ marginTop: '16px' }}
      />
    </>
  );
};

export default Environment;
