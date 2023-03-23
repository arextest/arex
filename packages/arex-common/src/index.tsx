import './userWorker';
import './i18n';

import AppFooter from './components/app/Footer';
import AppHeader from './components/app/Header';
import AppPaneLayout from './components/app/PaneLayout';
import AppSidenav from './components/app/Sidenav';
import Http from './components/http';
import CollectionMenu from './components/menus/CollectionMenu';
import EnvironmentMenu from './components/menus/EnvironmentMenu';
import ReplayMenu from './components/menus/ReplayMenu';
import MainTabs from './components/panes/MainTabs';
import RunPane from './components/panes/Run';
import { useMonaco } from './composables/monaco';
import cn_locale from './locales/cn.json';
import en_locale from './locales/en.json';
import LoginPage from './pages/Login';
import ArexCommonProvider from './providers/ArexCommonProvider';
export {
  AppFooter,
  AppHeader,
  AppPaneLayout,
  AppSidenav,
  ArexCommonProvider,
  cn_locale,
  CollectionMenu,
  en_locale,
  EnvironmentMenu,
  Http,
  LoginPage,
  MainTabs,
  ReplayMenu,
  RunPane,
  useMonaco,
};
