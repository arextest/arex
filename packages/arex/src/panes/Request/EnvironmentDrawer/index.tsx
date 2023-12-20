import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { PaneDrawer, PanesTitle, TooltipButton, useTranslation } from '@arextest/arex-core';
import { ArexEnvironment } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App, Button, Divider, Popconfirm, Space } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useImmer } from 'use-immer';

import { EnvironmentService } from '@/services';
import { EnvironmentKeyValues } from '@/services/EnvironmentService/getEnvironments';

import EditableKeyValueTable, { useColumns } from './EditableKeyValueTable';

export type EnvironmentDrawerProps = {
  workspaceId: string;
  onUpdate?: () => void;
};

export type EnvironmentDrawerRef = {
  open: (env: ArexEnvironment) => void;
};

export type WorkspaceEnvironmentPair = { [workspaceId: string]: string };

const EnvironmentDrawer = forwardRef<EnvironmentDrawerRef, EnvironmentDrawerProps>((props, ref) => {
  const [open, setOpen] = useState(false);

  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [envId, setEnvId] = useState<string>();
  const [envName, setEnvName] = useState<string>();
  const [keyValues, setKeyValues] = useImmer<(EnvironmentKeyValues & { id: string })[]>([]);
  const columns = useColumns(setKeyValues, true);

  const updateState = (env: ArexEnvironment) => {
    setEnvId(env.id);
    setEnvName(env.name);
    setKeyValues(
      env.variables?.map((v) => ({
        ...v,
        id: (Math.random() * 10e12).toFixed(),
      })) || [],
    );
  };

  const { run: saveEnv } = useRequest(EnvironmentService.saveEnvironment, {
    manual: true,
    onSuccess({ success }, [{ env }]) {
      if (success) {
        message.success(t('message.saveSuccess', { ns: 'common' }));
        updateState({ id: env.id as string, name: env.envName, variables: env.keyValues });
        props.onUpdate?.();
      }
    },
  });

  const { run: deleteEnvironment } = useRequest(
    () =>
      EnvironmentService.deleteEnvironment({
        workspaceId: props.workspaceId,
        id: envId!,
      }),
    {
      manual: true,
      ready: !!envId,
      onSuccess(success) {
        if (success) {
          setOpen(false);
          props.onUpdate?.();
        }
      },
    },
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (name?: string) => {
    saveEnv({
      env: {
        id: envId,
        workspaceId: props.workspaceId,
        keyValues,
        envName: name || envName || 'Untitled',
      },
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (env) => {
        updateState(env);
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <PaneDrawer
      destroyOnClose
      width={'60%'}
      open={open}
      onClose={handleClose}
      title={
        <PanesTitle
          editable
          title={envName}
          extra={
            <Space>
              <Divider type='vertical' />

              <TooltipButton
                icon={<PlusOutlined />}
                title={t('env.createEnvKeyValue')}
                onClick={() =>
                  setKeyValues((state) => {
                    state.push({
                      key: '',
                      value: '',
                      active: true,
                      id: (Math.random() * 10e12).toFixed(),
                    });
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
                onClick={() => handleSave()}
              />
            </Space>
          }
          onSave={handleSave}
        />
      }
      styles={{
        header: {
          padding: '1px 16px',
        },
      }}
    >
      <EditableKeyValueTable
        bordered
        showHeader
        size='small'
        rowKey='id'
        pagination={false}
        dataSource={keyValues}
        columns={columns}
      />
    </PaneDrawer>
  );
});

export default EnvironmentDrawer;
