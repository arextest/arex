import { RunPane } from 'arex-core';

import FolderPane from './Folder';
import RequestPane from './Request';
const paneConfig = [
  {
    pageType: 'folder',
    element: FolderPane,
  },
  {
    pageType: 'request',
    element: RequestPane,
  },
  {
    pageType: 'case',
    element: RequestPane,
  },
  {
    pageType: 'run',
    element: RunPane,
  },
];

export default paneConfig;
