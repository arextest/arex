import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/Icons';
import { FC } from 'react';

import { MenuTypeEnum } from '../constant';
import CollectionMenu, { CollectionMenuRef } from './CollectionMenu';
import EnvironmentMenu from './EnvironmentMenu';
import ReplayMenu from './ReplayMenu';

type MenuConfig = {
  title: string;
  Icon: FC;
  Menu: FC;
};

const config: MenuConfig[] = [
  {
    title: MenuTypeEnum.Collection,
    Icon: ApiOutlined,
    Menu: CollectionMenu,
  },
  {
    title: MenuTypeEnum.Replay,
    Icon: FieldTimeOutlined,
    Menu: ReplayMenu,
  },
  {
    title: MenuTypeEnum.Environment,
    Icon: DeploymentUnitOutlined,
    Menu: EnvironmentMenu,
  },
];

export default config;

export { CollectionMenu, EnvironmentMenu, ReplayMenu };

export type { CollectionMenuRef };
