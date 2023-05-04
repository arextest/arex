import { AimOutlined, DeploymentUnitOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, theme } from 'antd';
import { createArexMenu, SmallTextButton, SpaceBetweenWrapper, useTranslation } from 'arex-core';
import React, { FC } from 'react';

import { MenuSelect } from '../components';
import { MenusType, PanesType } from '../constant';
import { useNavPane } from '../hooks';
import { EnvironmentService } from '../services';
import { useEnvironments, useWorkspaces } from '../store';
import { Environment } from '../store/useEnvironments';

const EnvironmentMenu: FC = () => {
  const { t } = useTranslation(['common', 'components']);
  const navPane = useNavPane();

  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { activeEnvironment, timestamp, getEnvironments } = useEnvironments();

  const { activeWorkspaceId } = useWorkspaces();

  const handleEnvMenuClick = (id: string, env?: Environment) => {
    navPane({
      type: PanesType.ENVIRONMENT,
      id,
      data: env,
    });
  };

  const { run: createNewEnvironment } = useRequest(
    () =>
      EnvironmentService.saveEnvironment({
        env: {
          envName: 'New Environment',
          workspaceId: activeWorkspaceId,
          keyValues: [],
        },
      }),
    {
      manual: true,
      onSuccess() {
        message.success(t('message.saveSuccess'));
        // TODO 目前 MenuSelect 通过传递request的方式在内部进行数据管理,
        //  导致 需要借助 timestamp 来强制刷新数据, 造成了两次相同的数据请求
        //  后续需要优化
        getEnvironments();
      },
    },
  );

  return (
    <MenuSelect<Environment>
      small
      refresh
      rowKey='id'
      prefix={
        <SmallTextButton color={'primary'} icon={<PlusOutlined />} onClick={createNewEnvironment} />
      }
      onSelect={handleEnvMenuClick}
      placeholder={t('env.searchEnvironment', { ns: 'components' }) as string}
      request={() =>
        EnvironmentService.getEnvironments({ workspaceId: activeWorkspaceId as string })
      }
      requestOptions={{ refreshDeps: [timestamp, activeWorkspaceId] }}
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

export default createArexMenu(EnvironmentMenu, {
  type: MenusType.ENVIRONMENT,
  paneType: PanesType.ENVIRONMENT,
  icon: <DeploymentUnitOutlined />,
});
