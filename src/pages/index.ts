import { FC } from 'react';

import { Page, PageData } from '../store';
import Environment from './Environment';
import Folder from './Folder';
import HttpRequest from './HttpRequest';
import Replay from './Replay';
import ReplayAnalysis from './ReplayAnalysis';
import ReplayCase from './ReplayCase';
import ReplaySetting from './ReplaySetting';
import Setting from './Setting';
import WorkspaceOverview from './WorkspaceOverview';

export type PageProps<D extends PageData = undefined, P = unknown> = P & {
  page: Page<D>;
};

export type PageFC<D extends PageData = undefined, P = unknown> = FC<PageProps<D, P>>;

export enum PageTypeEnum {
  Collection = 'Collection',
  Environment = 'Environment',
  Folder = 'Folder',
  Request = 'HttpRequest',
  Replay = 'Replay',
  ReplayAnalysis = 'ReplayAnalysis',
  ReplayCase = 'ReplayCase',
  ReplaySetting = 'ReplaySetting',
  Setting = 'Setting',
  WorkspaceOverview = 'WorkspaceOverview',
}

export default {
  Environment,
  Folder,
  HttpRequest,
  Replay,
  ReplayAnalysis,
  ReplayCase,
  ReplaySetting,
  Setting,
  WorkspaceOverview,
};
