import { CopyOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { PaneDrawer, PanesTitle, TooltipButton, useTranslation } from '@arextest/arex-core';
import { ArexEnvironment } from '@arextest/arex-request';
import { useRequest } from 'ahooks';
import { App, Button, Divider, Modal, Popconfirm, Space, Tooltip } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useImmer } from 'use-immer';

import { FlexRowReverseWrapper } from '@/components';
import { EnvironmentService } from '@/services';
import { Environment, EnvironmentKeyValues } from '@/services/EnvironmentService/getEnvironments';

import EditableKeyValueTable, { useColumns } from './EditableKeyValueTable';

export type EnvironmentDrawerProps = {
  workspaceId: string;
  onUpdate?: () => void;
  onDuplicate?: (environment: Environment) => void;
  onDelete?: () => void;
};

export type EnvironmentDrawerRef = {
  open: (env: ArexEnvironment) => void;
};

export type WorkspaceEnvironmentPair = { [workspaceId: string]: string };

const EnvironmentDrawer = forwardRef<EnvironmentDrawerRef, EnvironmentDrawerProps>((props, ref) => {
  const [open, setOpen] = useState(false);

  const { message, modal } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [envId, setEnvId] = useState<string>();
  const [envName, setEnvName] = useState<string>();
  const [keyValues, setKeyValues] = useImmer<(EnvironmentKeyValues & { id: string })[]>([]);
  const [edited, setEdited] = useState(false);

  const handleKeyValuesChange: typeof setKeyValues = (...params) => {
    !edited && setEdited(true);
    setKeyValues(...params);
  };
  const columns = useColumns(handleKeyValuesChange, true);

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
      } else message.error(t('message.saveFailed', { ns: 'common' }));
    },
  });

  const { run: duplicateEnvironment } = useRequest(EnvironmentService.duplicateEnvironment, {
    manual: true,
    onSuccess(environments) {
      if (environments?.length) {
        message.success(t('message.createSuccess', { ns: 'common' }));
        setOpen(false);
        props.onDuplicate?.(environments[0]); // TODO get duplicated env id from response
      } else message.error(t('message.createFailed', { ns: 'common' }));
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
          props.onDelete?.();
        }
      },
    },
  );

  const handleClose = () => {
    if (edited) {
      const handleClose = () => {
        Modal.destroyAll();
        setOpen(false);
        setEdited(false);
      };

      modal.info({
        width: 340,
        title: <div style={{ paddingRight: '16px' }}>{t('http.env.closeConfirm')}</div>,
        closable: true,
        footer: (
          <FlexRowReverseWrapper style={{ marginTop: '8px' }}>
            <Space size='middle'>
              <Button
                key='save'
                type='primary'
                onClick={() => {
                  handleSave();
                  handleClose();
                }}
                style={{ marginBottom: 0 }}
              >
                {t('save', { ns: 'common' })}
              </Button>
              <Button key='noSave' onClick={handleClose}>
                {t('noSave', { ns: 'common' })}
              </Button>
            </Space>
          </FlexRowReverseWrapper>
        ),
      });
    } else setOpen(false);
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

  const handleCreateEnvVariable = () => {
    setKeyValues((state) => {
      state.push({
        key: '',
        value: '',
        active: true,
        id: (Math.random() * 10e12).toFixed(),
      });
    });
  };

  const handleDuplicateEnv = () => {
    duplicateEnvironment({
      workspaceId: props.workspaceId,
      id: envId!,
    });
  };

  const handleEnvSave = () => {
    setEdited(false);
    handleSave();
  };

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
                title={t('env.createEnvVariable')}
                onClick={handleCreateEnvVariable}
              />

              <TooltipButton
                icon={<CopyOutlined />}
                title={t('env.duplicateEnv')}
                onClick={handleDuplicateEnv}
              />

              <Tooltip title={t('env.deleteEnv')}>
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
              </Tooltip>

              <TooltipButton
                color='primary'
                icon={<SaveOutlined />}
                title={t('save', { ns: 'common' })}
                onClick={handleEnvSave}
              />
            </Space>
          }
          onSave={handleSave}
          style={{ margin: 0 }}
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
