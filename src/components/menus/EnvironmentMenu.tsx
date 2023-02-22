import { AimOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, theme } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCustomNavigate } from '../../router/useCustomNavigate';
import EnvironmentService from '../../services/Environment.service';
import { Environment } from '../../services/Environment.type';
import { useStore } from '../../store';
import MenuSelect from '../MenuSelect';
import { PagesType } from '../panes';
import { SmallTextButton, SpaceBetweenWrapper } from '../styledComponents';

const EnvironmentMenu: FC = () => {
  const { t } = useTranslation(['common', 'components']);
  const params = useParams();
  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const {
    activeWorkspaceId,
    activeEnvironment,
    environmentLastManualUpdateTimestamp,
    setEnvironmentLastManualUpdateTimestamp,
  } = useStore();

  const customNavigate = useCustomNavigate();

  const handleEnvMenuClick = (env: Environment) => {
    customNavigate(
      `/${params.workspaceId}/${PagesType.Environment}/${env.id}?data=${encodeURIComponent(
        JSON.stringify(env),
      )}`,
    );
  };

  const { run: createNewEnvironment } = useRequest(
    () =>
      EnvironmentService.saveEnvironment({
        env: {
          envName: 'New Environment',
          workspaceId: params.workspaceId,
          keyValues: [],
        },
      }),
    {
      manual: true,
      onSuccess() {
        message.success(t('message.saveSuccess'));
        setEnvironmentLastManualUpdateTimestamp(new Date().getTime());
      },
    },
  );

  return (
    <MenuSelect<Environment>
      small
      refresh
      rowKey='id'
      prefix={<SmallTextButton icon={<PlusOutlined />} onClick={createNewEnvironment} />}
      onSelect={handleEnvMenuClick}
      placeholder={t('env.searchEnvironment', { ns: 'components' })}
      request={() => EnvironmentService.getEnvironment({ workspaceId: activeWorkspaceId })}
      requestOptions={{ refreshDeps: [environmentLastManualUpdateTimestamp, activeWorkspaceId] }}
      filter={(keyword, env) => env.envName?.includes(keyword)}
      itemRender={(env) => ({
        label: (
          <SpaceBetweenWrapper>
            {env.envName}
            {activeEnvironment?.id === env.id && <AimOutlined style={{ color: colorPrimary }} />}
          </SpaceBetweenWrapper>
        ),
        key: env.id,
      })}
      sx={{
        padding: '8px 0',
      }}
    />
  );
};

export default EnvironmentMenu;
