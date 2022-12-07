import { PlusOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import MenuSelect from '../components/MenuSelect';
import { SmallTextButton } from '../components/styledComponents';
import { generateGlobalPaneId } from '../helpers/utils';
import { PagesType } from '../pages';
import EnvironmentService from '../services/Environment.service';
import { Environment } from '../services/Environment.type';
import { useStore } from '../store';
import { MenusType } from './index';

const NewEnvMenu: FC = () => {
  const { setPages, activeEnvironment, setActiveEnvironment } = useStore();
  const params = useParams();

  const handleEnvMenuClick = (env: Environment) => {
    setActiveEnvironment(env.id);
    setPages(
      {
        title: env.envName,
        menuType: MenusType.NewEnv,
        pageType: PagesType.Environment,
        isNew: false,
        data: env,
        paneId: generateGlobalPaneId(MenusType.NewEnv, PagesType.Environment, env.id),
        rawId: env.id,
      },
      'push',
    );
  };

  return (
    <MenuSelect<Environment>
      small
      refresh
      rowKey='id'
      prefix={<SmallTextButton icon={<PlusOutlined />} />}
      selectedKeys={activeEnvironment?.id ? [activeEnvironment.id] : []}
      onSelect={handleEnvMenuClick}
      placeholder='Search Environment'
      request={() =>
        EnvironmentService.getEnvironment({ workspaceId: params.workspaceId as string })
      }
      filter={(keyword, env) => env.envName?.includes(keyword)}
      itemRender={(env) => ({
        label: env.envName,
        key: env.id,
      })}
      sx={{
        padding: '8px 0',
      }}
    />
  );
};

export default NewEnvMenu;
