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

export enum MenuTypeEnum {
  Collection = 'collection',
  Replay = 'replay',
  Environment = 'environment',
}

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
