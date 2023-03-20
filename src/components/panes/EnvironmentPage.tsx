import {
  AimOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Divider, Popconfirm, Space } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import EnvironmentService from '../../services/Environment.service';
import { Environment } from '../../services/Environment.type';
import { useStore } from '../../store';
import EditableKeyValueTable, { useColumns } from '../EditableKeyValueTable';
import { TooltipButton } from '../index';
import PanesTitle, { PanesTitleProps } from '../styledComponents/PanesTitle';
import { PageFC } from './index';

const EnvironmentPage: PageFC<Environment> = (props) => {
  const {
    page: {
      data: { id },
    },
  } = props;
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const { workspaceId } = useParams();
  const {
    removePage,
    activeEnvironment,
    environmentTreeData,
    setActiveEnvironment,
    setEnvironmentLastManualUpdateTimestamp,
  } = useStore();

  const environment = useMemo(
    () => environmentTreeData.find((env) => env.id === id) || props.page.data,
    [id, environmentTreeData],
  );

  const [keyValues, setKeyValues] = useImmer(environment?.keyValues || []);

  const { run: saveEnv } = useRequest(EnvironmentService.saveEnvironment, {
    manual: true,
    onSuccess() {
      message.success(t('message.saveSuccess'));
      setEnvironmentLastManualUpdateTimestamp(new Date().getTime());
    },
  });

  const { run: duplicateEnvironment } = useRequest(
    () =>
      EnvironmentService.duplicateEnvironment({
        id: environment.id,
        workspaceId: workspaceId as string,
      }),
    {
      manual: true,
      ready: !!workspaceId,
      onSuccess(res) {
        if (res.body.success == true) {
          setEnvironmentLastManualUpdateTimestamp(new Date().getTime());
        }
      },
    },
  );

  const { run: deleteEnvironment } = useRequest(
    () =>
      EnvironmentService.deleteEnvironment({
        id: environment.id,
        workspaceId: workspaceId as string,
      }),
    {
      manual: true,
      onSuccess(res) {
        if (res.body.success == true) {
          setEnvironmentLastManualUpdateTimestamp(new Date().getTime());
          removePage(props.page.paneId);
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
              disabled={activeEnvironment?.id === id}
              icon={<AimOutlined />}
              placement='left'
              title={t('env.setCurrentEnv')}
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
        rowKey={'id'}
        pagination={false}
        dataSource={keyValues}
        // @ts-ignore
        columns={useColumns(setKeyValues, true)}
        style={{ marginTop: '16px' }}
      />
    </>
  );
};

export default EnvironmentPage;
