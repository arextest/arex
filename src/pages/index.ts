import { FC } from 'react';

import { Page, PageData } from '../store';
import EnvironmentPage from './EnvironmentPage';
import FolderPage from './FolderPage';
import HttpRequestPage from './HttpRequestPage';
import ReplayAnalysisPage from './ReplayAnalysisPage';
import ReplayCasePage from './ReplayCasePage';
import ReplayPage from './ReplayPage';
import ReplaySettingPage from './ReplaySettingPage';
import SettingPage from './SettingPage';
import WorkspaceOverviewPage from './WorkspaceOverviewPage';

export type PageProps<D extends PageData = undefined, P = unknown> = P & {
  page: Page<D>;
};

/**
 * pages 下所有组件请使用 PageFC 进行定义
 */
export type PageFC<D extends PageData = undefined, P = unknown> = FC<PageProps<D, P>>;

/**
 * PageTypeEnum 的 value 需要和对应组件同名
 */
export enum PageTypeEnum {
  Collection = 'CollectionPage',
  Environment = 'EnvironmentPage',
  Folder = 'FolderPage',
  Request = 'HttpRequestPage',
  Replay = 'ReplayPage',
  ReplayAnalysis = 'ReplayAnalysisPage',
  ReplayCase = 'ReplayCasePage',
  ReplaySetting = 'ReplaySettingPage',
  Setting = 'SettingPage',
  WorkspaceOverview = 'WorkspaceOverviewPage',
}

/**
 * 在此导出所有 page 的一级组件
 */
const Pages: Record<string, FC<any>> = {
  EnvironmentPage,
  FolderPage,
  HttpRequestPage,
  ReplayPage,
  ReplayAnalysisPage,
  ReplayCasePage,
  ReplaySettingPage,
  SettingPage,
  WorkspaceOverviewPage,
};

export default Pages;
