import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { FC } from 'react';

import CollectionMenu from './CollectionMenu';
import EnvironmentMenu from './EnvironmentMenu';
import ReplayMenu from './ReplayMenu';

type MenuConfig = {
  title: string;
  Icon: FC;
  Menu: FC;
};

export const MenuType = {
  Collection: 'collection',
  Replay: 'replay',
  Environment: 'environment',
};

// TODO import ExtraConfig
// import ExtraConfig from 'src/extra/menus'
const ExtraConfig: MenuConfig[] = [];

const CommonConfig: MenuConfig[] = [
  {
    title: MenuType.Collection,
    Icon: ApiOutlined,
    Menu: CollectionMenu,
  },
  {
    title: MenuType.Replay,
    Icon: FieldTimeOutlined,
    Menu: ReplayMenu,
  },
  {
    title: MenuType.Environment,
    Icon: DeploymentUnitOutlined,
    Menu: EnvironmentMenu,
  },
];

const Config = [...CommonConfig, ...ExtraConfig];

export default Config;
export { CollectionMenu, EnvironmentMenu, ReplayMenu };
