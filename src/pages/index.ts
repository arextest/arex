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
import BatchRunPage from './BatchRunPage';

export type PageProps<D extends PageData = undefined, P = unknown> = P & {
  page: Page<D>;
};

/**
 * All components under pages folder should be defined using PageFC
 */
export type PageFC<D extends PageData = undefined, P = unknown> = FC<PageProps<D, P>>;

export type PageType<T extends string> = `${T}Page`;
export type PagesTypeType = { [type: string]: PageType<typeof type> };

// TODO import ExtraPagesType
// import ExtraPagesType from 'src/extra/pages'
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
  ReplayAnalysis: 'ReplayAnalysisPage',
  ReplayCase: 'ReplayCasePage',
  ReplaySetting: 'ReplaySettingPage',
  Setting: 'SettingPage',
  WorkspaceOverview: 'WorkspaceOverviewPage',
  BatchRun: 'BatchRunPage',
};

export const PagesType = Object.assign(CommonPageType, ExtraPagesType);

export type PageComponents = { [pageType: string]: FC<any> };

// TODO import ExtraPage
// import ExtraPages from 'src/extra/pages'
const ExtraPages: PageComponents = {};

/**
 * Export the first-level components of all pages
 */
const CommonPages: PageComponents = {
  EnvironmentPage,
  FolderPage,
  HttpRequestPage,
  ReplayPage,
  ReplayAnalysisPage,
  ReplayCasePage,
  ReplaySettingPage,
  SettingPage,
  WorkspaceOverviewPage,
  BatchRunPage,
};

export default Object.assign(CommonPages, ExtraPages);
