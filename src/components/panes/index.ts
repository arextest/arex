import { FC } from 'react';

import { Page, PageData } from '../../store';
import AppSettingPage from './AppSettingPage';
import BatchComparePage from './BatchComparePage';
import BatchRunPage from './BatchRunPage';
import EnvironmentPage from './EnvironmentPage';
import FolderPage from './FolderPage';
import HttpRequestPage from './HttpRequestPage';
import ReplayAnalysisPage from './ReplayAnalysisPage';
import ReplayCasePage from './ReplayCasePage';
import ReplayDiffPage from './ReplayDiffPage';
import ReplayPage from './ReplayPage';
import RunPage from './RunPage';
import SettingPage from './SettingPage';
import WorkspaceOverviewPage from './WorkspacePage';

export type PageProps<D extends PageData = undefined, P = unknown> = P & {
  page: Page<D>;
};

/**
 * All components under panes folder should be defined using PageFC
 */
export type PageFC<D extends PageData = undefined, P = unknown> = FC<PageProps<D, P>>;

export type PageType<T extends string> = `${T}Page`;
export type PagesTypeType = { [type: string]: PageType<typeof type> };

// TODO import ExtraPagesType
// import ExtraPagesType from 'src/extra/panes'
const ExtraPagesType: PagesTypeType = {};

/**
 * The value of the PageType needs to be the same name as the corresponding component
 */
const CommonPageType: PagesTypeType = {
  Collection: 'CollectionPage',
  Environment: 'EnvironmentPage',
  Folder: 'FolderPage',
  Request: 'HttpRequestPage',
  Replay: 'ReplayPage',
  ReplayDiff: 'ReplayDiffPage',
  ReplayAnalysis: 'ReplayAnalysisPage',
  ReplayCase: 'ReplayCasePage',
  AppSetting: 'AppSettingPage',
  Setting: 'SettingPage',
  WorkspaceOverview: 'WorkspaceOverviewPage',
  BatchRun: 'BatchRunPage',
  BatchCompare: 'BatchComparePage',
  Run: 'RunPage',
};

export const PagesType = Object.assign(CommonPageType, ExtraPagesType);

export type PageComponents = { [pageType: string]: FC<any> };

// TODO import ExtraPage
// import ExtraPages from 'src/extra/panes'
const ExtraPages: PageComponents = {};

/**
 * Export the first-level components of all panes
 */
const CommonPages: PageComponents = {
  EnvironmentPage,
  FolderPage,
  HttpRequestPage,
  ReplayPage,
  ReplayDiffPage,
  ReplayAnalysisPage,
  ReplayCasePage,
  AppSettingPage,
  SettingPage,
  WorkspaceOverviewPage,
  BatchRunPage,
  BatchComparePage,
  RunPage,
};

export default Object.assign(CommonPages, ExtraPages);

export enum MenusType {
  Collection = 'collection',
  Replay = 'replay',
  AppSetting = 'appSetting',
  Environment = 'environment',
  Setting = 'setting',
}
