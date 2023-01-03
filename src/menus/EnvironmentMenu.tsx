import { AimOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, theme } from 'antd';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import MenuSelect from '../components/MenuSelect';
import { SmallTextButton, SpaceBetweenWrapper } from '../components/styledComponents';
import { generateGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import EnvironmentService from '../services/Environment.service';
import { Environment } from '../services/Environment.type';
import { useStore } from '../store';
import { MenusType } from './index';

const EnvironmentMenu: FC = () => {
  const params = useParams();
  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const {
    setPages,
    activeWorkspaceId,
    activeEnvironment,
    environmentLastManualUpdateTimestamp,
    setEnvironmentLastManualUpdateTimestamp,
  } = useStore();

  const handleEnvMenuClick = (env: Environment) => {
    setPages(
      {
        title: env.envName,
        menuType: MenusType.Environment,
        pageType: PagesType.Environment,
        isNew: false,
        data: env,
        paneId: generateGlobalPaneId(MenusType.Environment, PagesType.Environment, env.id),
        rawId: env.id,
      },
      'push',
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
        message.success('success');
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
      placeholder='Search Environment'
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
